export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  API_CURRENT_URL: process.env.NEXT_PUBLIC_API_CURRENT_URL || '',
  API_AUTH_URL: process.env.NEXT_PUBLIC_API_AUTH_URL || '',
  PEER_HOST: process.env.NEXT_PUBLIC_NEXT_PUBLIC_PEER_HOST || '',
  SITE_BASE_URL: process.env.NEXT_PUBLIC_SITE_BASE_URL || '',
  PEER_PORT: process.env.NEXT_PUBLIC_PEER_PORT || '',
  PEER_PATH: process.env.NEXT_PUBLIC_PEER_PATH || '',
  SOCKET_URL:
    process.env.NEXT_PUBLIC_SOCKET_URL || 'https://dev-indexer.unify.mx/',

  IPFS_UPLOAD_SERVER_URL:
    process.env.NEXT_PUBLIC_IPFS_UPLOAD_SERVER_URL ??
    'https://ipfs-ops-api.rep.run',
  IPFS_BASE_URL:
    process.env.NEXT_PUBLIC_IPFS_BASE_URL ??
    'https://ipfs-ops-api.rep.run/ipfs/',
  IPFS_UPLOAD_FILE_PATHNAME:
    process.env.NEXT_PUBLIC_IPFS_UPLOAD_FILE_PATHNAME ?? '/api/v1/uploadFile'
};
