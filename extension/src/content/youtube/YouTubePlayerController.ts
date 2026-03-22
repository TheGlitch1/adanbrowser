// Controls the YouTube video player on the current page.
// Responsible for: detecting playback state, pausing, and resuming the video.
//
// All YouTube DOM selectors are isolated here.
// If YouTube changes its player structure, only this file needs to be updated.

/** YouTube's main player video element — scoped to the primary player container. */
const VIDEO_SELECTOR = '#movie_player video';

export interface YouTubePlayerController {
  /** Returns true if the video is currently playing (not paused, not ended). */
  isPlaying(): boolean;
  pause(): void;
  resume(): void;
}

/**
 * Creates a controller bound to the YouTube video element found in the current DOM.
 * Returns null if no player element is found (e.g. navigated away from a watch page).
 */
export function createYouTubePlayerController(): YouTubePlayerController | null {
  const video = document.querySelector<HTMLVideoElement>(VIDEO_SELECTOR);
  if (!video) return null;

  return {
    isPlaying() {
      return !video.paused && !video.ended && video.readyState > 2;
    },

    pause() {
      video.pause();
    },

    resume() {
      // play() returns a Promise; autoplay policy rejection is intentionally ignored here
      // because the user will have interacted with the page to reach this state.
      video.play().catch(() => {
        // TODO: surface a user-facing prompt if autoplay is blocked
      });
    },
  };
}
