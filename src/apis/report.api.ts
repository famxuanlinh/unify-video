import { CreateReportPayload, CreateReportResponse } from '@/types/report';

import { apiMain } from '@/lib';

export const report = {
  async create(payload: CreateReportPayload): Promise<CreateReportResponse> {
    return apiMain.post('/reports', payload).then(res => ({
      ...res.data
    }));
  }
};
