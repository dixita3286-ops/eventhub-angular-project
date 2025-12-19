export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  fees: number;
  image: string;
  file: string;
  createdBy: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
