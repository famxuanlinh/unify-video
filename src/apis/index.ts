import { auth } from './auth.api';
import { report } from './report.api';
import { review } from './review.api';
import { user } from './user.api';

const UnifyApi = { auth, user, review, report };

export default UnifyApi;
