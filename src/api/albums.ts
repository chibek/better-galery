import { getDb } from "@db/client";
import { albumMetadata } from "@db/schema";
import { eq } from "drizzle-orm";
import * as MediaLibrary from "expo-media-library";

const EXCLUDED_ALBUM_TITLES = new Set([
  "recents",
  "all photos",
  "user library",
]);

export async function getAlbumsMinimal(
  permissionGranted: boolean,
  isLimited: boolean
): Promise<(MediaLibrary.Album & { coverUri: string | null })[]> {
  if (!permissionGranted) return [];

  try {
    const db = getDb();

    // 1. Fetch data in parallel
    // Added explicit catch for each promise to identify exactly which one fails if needed
    const [fetchedAlbums, localMeta, allAssets] = await Promise.all([
      !isLimited
        ? MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true })
        : Promise.resolve([] as MediaLibrary.Album[]),
      db
        .select({
          albumId: albumMetadata.albumId,
          coverUri: albumMetadata.coverUri,
        })
        .from(albumMetadata)
        .all(),
      MediaLibrary.getAssetsAsync({ first: 1 }),
    ]);

    // 2. Prepare Metadata Map early
    const metaMap = new Map(localMeta.map((m) => [m.albumId, m.coverUri]));

    // 3. Process filtered albums and map metadata in one pass
    const userAlbums = fetchedAlbums
      .filter(
        (a) =>
          a.assetCount > 0 && !EXCLUDED_ALBUM_TITLES.has(a.title.toLowerCase())
      )
      .map((album) => ({
        ...album,
        coverUri: metaMap.get(album.id) ?? null,
      }));

    // 4. Construct the "Synthetic" primary album
    const allPhotos: MediaLibrary.Album & { coverUri: string | null } = {
      id: "all",
      title: isLimited ? "Selected Photos" : "All Photos", // Clarity for iOS limited mode
      assetCount: allAssets.totalCount,
      type: "smartAlbum",
      startTime: 0,
      endTime: 0,
      coverUri: metaMap.get("all") ?? null, // Check if "All Photos" has a custom cover
    };

    return [allPhotos, ...userAlbums];
  } catch (err) {
    // Log context with the error
    console.error("❌ getAlbumsMinimal failed:", { isLimited, error: err });
    throw err;
  }
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
