export interface CreateReviewPayload {
  reviewedUserId: string;
  rating: string;
  comment: string;
  connectionTypes?: string[];
  pass?: boolean;
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
