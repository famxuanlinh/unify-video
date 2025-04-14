import { GetLobbyParams, LobbyResponse } from '@/types/lobby';
import QueryString from 'qs';

import { apiMain } from '@/lib';

export const lobby = {
  async getMany(payload: GetLobbyParams): Promise<LobbyResponse> {
    return apiMain
      .get(`/connections?${QueryString.stringify(payload)}`)
      .then(res => ({
        ...res.data
      }));
  }
};
