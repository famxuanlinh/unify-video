import { CreateReviewPayload, CreateReviewResponse } from '@/types/review';
import { parseToUsername } from '@/utils';

import { apiMain } from '@/lib';

export const review = {
  async create(payload: CreateReviewPayload): Promise<CreateReviewResponse> {
    return apiMain.post('/call-review', payload).then(res => ({
      ...res.data,
      accountId: parseToUsername(res.data.userId)
    }));
  }
};
