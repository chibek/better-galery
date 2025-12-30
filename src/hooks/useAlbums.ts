import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as MediaLibrary from "expo-media-library";
import {
  createAlbum,
  getAlbumDescription,
  getAlbumsMinimal,
} from "@api/albums";

export function useAlbums(permissionGranted: boolean) {
  return useQuery({
    queryKey: ["albums"],
    enabled: permissionGranted,
    queryFn: async () => {
      const albums = await getAlbumsMinimal(permissionGranted);

      // If we have permission but no albums are returned (common in "Limited" mode),
      // or even if they are, we often want a "Recents" entry at the top.
      if (albums.length === 0 && permissionGranted) {
        return [
          {
            id: "all",
            title: "Recents",
            assetCount: 0, // Assets will be fetched by the assets hook
            type: "smartAlbum",
          } as MediaLibrary.Album,
        ];
      }

      return albums;
    },
  });
}

export function useAlbumDescription(albumId: string) {
  return useQuery({
    queryKey: ["album-description", albumId],
    enabled: !!albumId && albumId !== "all",
    queryFn: () => getAlbumDescription(albumId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      title: string;
      assetIds: string[];
      coverUri?: string;
      description?: string;
    }) =>
      createAlbum(
        variables.title,
        variables.assetIds,
        variables.coverUri,
        variables.description
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["albums"] }),
  });
}

export function useAlbumAssets(albumId: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["album-assets", albumId],
    // Ensure "all" is treated as a valid ID to trigger the fetch
    enabled: enabled && !!albumId,
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const options: MediaLibrary.AssetsOptions = {
        first: 50,
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        mediaType: ["photo", "video"],
        after: pageParam,
      };

      // CRITICAL: If id is "all", do NOT attach the album property.
      // This fetches the "Selected Photos" in limited mode.
      if (albumId !== "all") {
        options.album = albumId;
      }

      return await MediaLibrary.getAssetsAsync(options);
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.endCursor : undefined,
  });
}
