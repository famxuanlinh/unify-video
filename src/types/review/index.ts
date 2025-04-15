export interface CreateReviewPayload {
  reviewedUserId: string;
  rating: number;
  comment: string;
  connectionTypes?: string[];
  pass?: boolean;
  callId: string;
}
export interface CreateReviewResponse {
  review: Review;
  connection: string;
  passed: boolean;
}

interface Review {
  id: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: string;
  comment: string;
  createdAt: string;
}
