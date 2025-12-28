import * as MediaLibrary from "expo-media-library";
import { albumMetadata } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "@db/client";
/**
 * SLIM FETCH: Optimized for the main list scroll performance.
 */
export async function getAlbumsMinimal(permissionGranted: boolean) {
  if (!permissionGranted) return [];

  // Parallel execution for speed
  const [fetchedAlbums, localMeta] = await Promise.all([
    MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true }),
    db
      .select({
        albumId: albumMetadata.albumId,
        coverUri: albumMetadata.coverUri,
      })
      .from(albumMetadata)
      .all(),
  ]);

  const filtered = fetchedAlbums.filter(
    (a: MediaLibrary.Album) =>
      a.assetCount > 0 && a.title !== "Recents" && a.title !== "All Photos"
  );

  const allAssets = await MediaLibrary.getAssetsAsync({ first: 1 });

  const allPhotos: MediaLibrary.Album = {
    id: "all",
    title: "All Photos",
    assetCount: allAssets.totalCount,
    type: "smartAlbum",
    startTime: 0,
    endTime: 0,
  };

  return [allPhotos, ...filtered].map((album) => ({
    ...album,
    coverUri:
      (localMeta as any[]).find(
        (m: { albumId: string; coverUri: string | null }) =>
          m.albumId === album.id
      )?.coverUri ?? null,
  }));
}

/**
 * LAZY FETCH: Fetches only the description when a user views album details.
 */
export async function getAlbumDescription(albumId: string) {
  const result = await db
    .select({ description: albumMetadata.description })
    .from(albumMetadata)
    .where(eq(albumMetadata.albumId, albumId))
    .get();
  return result?.description ?? "";
}

/**
 * WRITE OPERATION: Handles physical creation and metadata sync.
 */
export async function createAlbum(
  title: string,
  assetIds: string[],
  coverUri?: string,
  description?: string
) {
  const album = await MediaLibrary.createAlbumAsync(title, assetIds[0], false);

  if (assetIds.length > 1) {
    await MediaLibrary.addAssetsToAlbumAsync(assetIds.slice(1), album, false);
  }

  await db.insert(albumMetadata).values({
    albumId: album.id,
    description: description ?? "",
    coverUri: coverUri ?? "",
  });

  return album;
}

export async function addAssetsToAlbum(assetIds: string[], albumId: string) {
  try {
    await MediaLibrary.addAssetsToAlbumAsync(assetIds, albumId, false);
    return true;
  } catch (e) {
    console.error("Failed to add assets to album", e);
    return false;
  }
}
