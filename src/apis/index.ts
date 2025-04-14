import { auth } from './auth.api';
import { lobby } from './lobby.api';
import { report } from './report.api';
import { review } from './review.api';
import { user } from './user.api';

const UnifyApi = { auth, user, review, report, lobby };

export default UnifyApi;
