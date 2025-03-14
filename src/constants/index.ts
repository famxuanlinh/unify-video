export * from './common';
export * from './env';

/**
 * This constants used for reducing redudant communities.
 * All urls listed in the constant will be evaluated as original url
 * ex: https://www.youtube.com/results -> https://www.youtube.com
 */
export const SAME_COMMUNITY_URLS: Record<string, RegExp[]> = {
  'https://www.youtube.com': [
    /^https:\/\/(www|m)\.youtube\.com\/results/,
    /^https:\/\/(www|m)\.youtube\.com\/playlist/,
    /^https:\/\/(www|m)\.youtube\.com\/feed\/trending/,
    /^https:\/\/(www|m)\.youtube\.com\/channel/,
    /^https:\/\/(www|m)\.youtube\.com\/feed\/history/,
    /^https:\/\/(www|m)\.youtube\.com\/live/
  ],
  'https://www.facebook.com': [
    /^https:\/\/(www|m)\.facebook\.com\/search/,
    /^https:\/\/(www|m)\.facebook\.com\/messages/,
    /^https:\/\/(www|m)\.facebook\.com\/stories/,
    /^https:\/\/(www|m)\.facebook\.com\/memories/,
    /^https:\/\/(www|m)\.facebook\.com\/saved/,
    /^https:\/\/(www|m)\.facebook\.com\/settings/,
    /^https:\/\/(www|m)\.facebook\.com\/watch\/live/,
    /^https:\/\/(www|m)\.facebook\.com\/watch\/saved/
  ],
  'https://x.com/home': [
    /^https:\/\/(m\.)?twitter\.com\/search/,
    /^https:\/\/(m\.)?x\.com\/search/,
    /^https:\/\/(m\.)?x\.com\/[A-Za-z0-9]+\/lists/,
    /^https:\/\/(m\.)?x\.com\/i\/bookmarks/,
    /^https:\/\/(m\.)?x\.com\/jobs/,
    /^https:\/\/(m\.)?x\.com\/settings/,
    /^https:\/\/(m\.)?x\.com\/compose\/post/,
    /^https:\/\/(m\.)?x\.com\/messages/
  ],
  'https://www.linkedin.com/feed': [
    /^https:\/\/(www|m)\.linkedin\.com\/mynetwork/,
    /^https:\/\/(www|m)\.linkedin\.com\/jobs/,
    /^https:\/\/(www|m)\.linkedin\.com\/search\/results/,
    /^https:\/\/(www|m)\.linkedin\.com\/messaging/,
    /^https:\/\/(www|m)\.linkedin\.com\/notifications/,
    /^https:\/\/(www|m)\.linkedin\.com\/manage/
  ]
};
