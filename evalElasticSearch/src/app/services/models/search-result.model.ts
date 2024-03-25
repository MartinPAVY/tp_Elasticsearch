export interface SearchResult {
  track_id: string,
  artists: string[],
  album_name: string,
  track_name: string,
  track_genre: string[],

  popularity: number,
  duration_ms: number,
  explicit: number,

  key: number,
  mode: number,
  tempo: number,
  time_signature: number,

  danceability: number,
  energy: number,
  loudness: number,
  speechiness: number,
  acousticness: number,
  instrumentalness: number,
  liveness: number,
  valence: number
}
