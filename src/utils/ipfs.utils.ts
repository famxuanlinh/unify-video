import { env } from '@/constants';
import axios from 'axios';

export class IPFSUtils {
  public static uploadFileToIPFS({
    file,
    onSuccess,
    onError
  }: {
    file: File;
    onSuccess?: (url: string) => any;
    onError?: any;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const body = new FormData();
      body.append('file', file);
      axios
        .post(env.IPFS_UPLOAD_SERVER_URL + env.IPFS_UPLOAD_FILE_PATHNAME, body)
        .then(async (res: any) => {
          const url = res.data.data;
          // const url = IPFS_BASE_URL + res.data.data;
          if (onSuccess) await onSuccess(url);
          resolve(url);

          return url;
        })
        .catch(async (err: any) => {
          if (onError) await onError(err);
          reject();
          throw 'Upload failed';
        });
    });
  }
}
