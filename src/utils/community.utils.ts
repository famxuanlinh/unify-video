import { NextRouter } from 'next/router';

import { SAME_COMMUNITY_URLS } from '@/constants';

import { b64DecodeUnicode, b64EncodeUnicode } from '.';

export enum CommunityId {
  Local = 'Home',
  Rep = 'Rep',
  RepSocial = 'RepSocial',
  GalaFriends = 'GalaFriends',
  LunarStormFriends = 'LunarStormFriends',
  General = 'General',
  NewTab = 'newtab'
}

export const communities = {
  [CommunityId.Local]: {
    name: 'Home',
    darkIcon: '',
    lightIcon: '',
    prefix: 'home',
    isEmbeddedOrExtension: true
  },
  [CommunityId.RepSocial]: {
    name: 'Rep Social',
    darkIcon: '',
    lightIcon: '',
    prefix: 'rep-social',
    isEmbeddedOrExtension: true
  },
  [CommunityId.Rep]: {
    name: 'Rep',
    darkIcon: '',
    lightIcon: '',
    prefix: 'rep',
    isEmbeddedOrExtension: false
  },
  [CommunityId.GalaFriends]: {
    name: 'Gala Friends',
    darkIcon: '',
    lightIcon: '',
    prefix: 'gala-friends',
    isEmbeddedOrExtension: false
  },
  [CommunityId.LunarStormFriends]: {
    name: 'LunarStorm Friends',
    darkIcon: '',
    lightIcon: '',
    prefix: 'lunar-storm-friends',
    isEmbeddedOrExtension: false
  }
};

export function getCommunities() {
  return Object.values(communities);
}

export function getCommunityName(communityId: CommunityId): string | null {
  if (communityId && communities[communityId]) {
    return communities[communityId]?.name;
  }
  return null;
}

export function getCommunityId(
  router: NextRouter,
  isEmbeddedOrChromeExtension?: boolean
): CommunityId {
  const communityId = router.query?.community;

  if (!communityId) {
    if (isEmbeddedOrChromeExtension) return CommunityId.Local;
    return CommunityId.Rep;
  }

  const allCommunities = Object.keys(communities) as CommunityId[];
  for (const comm of allCommunities) {
    if (communityId === communities[comm].prefix) {
      return comm;
    }
  }

  return isEmbeddedOrChromeExtension ? CommunityId.Local : CommunityId.Rep;
}

export function getCommPrefixUrl(router: NextRouter): string {
  const communityId = getCommunityId(router);
  return communities[communityId]?.prefix ?? 'rep';
}

export function extractCommunityIdFromPostId(postId: string): CommunityId {
  const components = postId.split('_');
  return CommunityId[components[0] as keyof typeof CommunityId];
}

export function isYoutubeVideoLink(url: string) {
  const MATCH_URL_YOUTUBE =
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//;
  return MATCH_URL_YOUTUBE.test(url);
}

/**
 * Formats a YouTube URL into a standardized form
 *
 * If YouTube watch links => only it extracts the video ID and remove other params
 * @param {string} url - The input URL to be checked and possibly formatted.
 * @returns {string} - new URL.
 */
function getStandardUrl(url: string) {
  // All urls that match in SAME_COMMUNITY_URLS will be evaluated as original url, see constant for more info
  for (const standardCommnunity in SAME_COMMUNITY_URLS) {
    const sameCommunityUrls = SAME_COMMUNITY_URLS[standardCommnunity];
    for (const urlRegex of sameCommunityUrls) {
      if (urlRegex.test(url)) {
        return standardCommnunity;
      }
    }
  }

  if (isYoutubeVideoLink(url)) {
    const newUrl = new URL(url);
    const videoId = newUrl.searchParams.get('v');

    if (videoId) {
      newUrl.search = '';
      newUrl.searchParams.append('v', videoId);
    }

    return newUrl.toString();
  }

  return url;
}

/**
 * Create a community url with no special characters from a url
 * by removing protocol (http:// or https://) and trailing slash (/) from a URL, encode url and then encode in base64
 * @param url - The URL to be sanitized
 * @returns The sanitized URL
 */
export const sanitizeUrl = (url: string): string => {
  if (url === 'chrome://newtab/') return 'newtab';

  const standardUrl = getStandardUrl(url);

  return b64EncodeUnicode(
    encodeURIComponent(
      standardUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    )
  );
};

export const unSanitizeUrl = (hash: string): string | null => {
  try {
    return decodeURIComponent(b64DecodeUnicode(hash));
  } catch (e) {
    console.log(`Can not unSanitizeUrl: ${hash}`, e);
    return null;
  }
};

/**
 * is Standard Web Rep's Commnunity
 * @param community
 * @returns
 */
export const isStandardCommunity = (community: string) => {
  const standardCommunities = [
    CommunityId.Rep,
    CommunityId.GalaFriends,
    CommunityId.LunarStormFriends
  ];

  return standardCommunities.includes(community as CommunityId);
};

/**
 * A local community is a community that is hashed from a specific website URL (for example, https://youtube.com).
 * @param community
 * @returns
 */
export const isLocalCommunity = (community: string) => {
  const communityValues = Object.values(CommunityId);
  return !communityValues.includes(community as CommunityId);
};

/**
 * Is the community hashed from a YouTube video link?
 * @param community
 * @returns
 */
export function isYoutubeVideoCommunity(community: string) {
  if (isLocalCommunity(community)) {
    const communityUrl = unSanitizeUrl(community);
    return isYoutubeVideoLink(communityUrl as string);
  }
  return false;
}

/**
 * Return the community URL if it's a local community; otherwise, return the original value.
 * @param communityId
 * @returns
 */
export function getCommunityUrl(communityId: string) {
  if (isLocalCommunity(communityId)) {
    const communityUrl = unSanitizeUrl(communityId);
    return communityUrl;
  }
  return communityId;
}
