import * as MediaLibrary from "expo-media-library";

const ALBUM_COLORS = [
  "#FECACA", // red-200
  "#FDE68A", // amber-200
  "#BBF7D0", // green-200
  "#A7F3D0", // emerald-200
  "#BAE6FD", // sky-200
  "#C7D2FE", // indigo-200
  "#DDD6FE", // violet-200
  "#FBCFE8", // pink-200
  "#E9D5FF", // purple-200
  "#FFE4E6", // rose-100
];

export function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0; // keep 32-bit
  }
  return Math.abs(hash);
}

export function getAlbumColor(album: MediaLibrary.Album) {
  // Special case for our custom "All Photos" album
  if (album.id === "all") return "#9ab8f6ff";

  const key = album.id ?? album.title ?? "";
  const idx = hashString(key) % ALBUM_COLORS.length;
  return ALBUM_COLORS[idx];
}
