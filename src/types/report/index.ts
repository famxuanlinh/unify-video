export interface CreateReportPayload {
  reportedUserId: string;
  reportType: string;
  description: string;
  other?: string;
}

export interface CreateReportResponse {
  review: Report;
  connection: string;
  passed: boolean;
}

interface Report {
  id: string;
  reviewerId: string;
  reviewedUserId: string;
  rating: string;
  comment: string;
  createdAt: string;
}
