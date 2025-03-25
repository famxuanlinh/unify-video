import { User, UpdateUserPayload } from '@/types';
import { parseToUsername } from '@/utils';
import qs from 'qs';

import { apiMain } from '@/lib';

export const user = {
  async get({ userId }: { userId?: string }): Promise<User> {
    return apiMain
      .get(
        `/profile/get?${qs.stringify({
          userId
        })}`
      )
      .then(res => res.data);
  },
  async update(payload: UpdateUserPayload): Promise<User> {
    return apiMain.post('/profile/update', payload).then(res => ({
      ...res.data,
      accountId: parseToUsername(res.data.userId)
    }));
  }
};
