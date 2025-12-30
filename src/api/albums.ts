import * as MediaLibrary from "expo-media-library";
import { eq } from "drizzle-orm";
import { getDb } from "@db/client";
import { albumMetadata } from "@db/schema";

/**
 * Get minimal album data with cover URIs from metadata
 * Optimized with parallel fetching and proper filtering
 */
export async function getAlbumsMinimal(
  permissionGranted: boolean
): Promise<Array<MediaLibrary.Album & { coverUri: string | null }>> {
  if (!permissionGranted) return [];

  const db = getDb();

  // 1. Fetch data in parallel
  const [fetchedAlbums, localMeta, allAssets] = await Promise.all([
    MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true }),
    db
      .select({
        albumId: albumMetadata.albumId,
        coverUri: albumMetadata.coverUri,
      })
      .from(albumMetadata)
      .all(),
    // Fetching with no album ID gives us the count of EVERY permitted photo
    MediaLibrary.getAssetsAsync({ first: 1 }),
  ]);

  // 2. Filter out system albums that would duplicate our manual "All Photos"
  // but keep user-created albums even in limited mode.
  const filtered = fetchedAlbums.filter(
    (a: MediaLibrary.Album) =>
      a.assetCount > 0 &&
      a.title.toLowerCase() !== "recents" &&
      a.title.toLowerCase() !== "all photos" &&
      a.title.toLowerCase() !== "user library"
  );

  // 3. Create the "Synthetic" album for the selected photos
  const allPhotos: MediaLibrary.Album = {
    id: "all", // This ID is handled by your useAlbumAssets hook
    title: "All Photos",
    assetCount: allAssets.totalCount, // In limited mode, this is exactly the # of selected photos
    type: "smartAlbum",
    startTime: 0,
    endTime: 0,
  };

  const metaMap = new Map(localMeta.map((m) => [m.albumId, m.coverUri]));

  // 4. Always put "All Photos" first
  return [allPhotos, ...filtered].map((album) => ({
    ...album,
    coverUri: metaMap.get(album.id) ?? null,
  }));
}
/**
 * LAZY FETCH: Fetches only the description when a user views album details.
 */
export async function getAlbumDescription(albumId: string): Promise<string> {
  const db = getDb();
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
): Promise<MediaLibrary.Album> {
  const db = getDb();
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

/**
 * Add assets to an existing album
 */
export async function addAssetsToAlbum(
  assetIds: string[],
  albumId: string
): Promise<boolean> {
  try {
    await MediaLibrary.addAssetsToAlbumAsync(assetIds, albumId, false);
    return true;
  } catch (e) {
    console.error("Failed to add assets to album", e);
    return false;
  }
}
