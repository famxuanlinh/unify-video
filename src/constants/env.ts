export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  API_AUTH_URL: process.env.NEXT_PUBLIC_API_AUTH_URL || '',
  PEER_HOST: process.env.NEXT_PUBLIC_NEXT_PUBLIC_PEER_HOST || '',
  SITE_BASE_URL: process.env.NEXT_PUBLIC_SITE_BASE_URL || '',
  PEER_PORT: process.env.NEXT_PUBLIC_PEER_PORT || '',
  PEER_PATH: process.env.NEXT_PUBLIC_PEER_PATH || '',
  SOCKET_URL:
    process.env.NEXT_PUBLIC_SOCKET_URL || 'https://dev-indexer.unify.mx/'
};
