export interface Registration {
  _id: string;
  eventId: string;
  studentId: string;
  paymentStatus: 'paid' | 'unpaid';
  registeredAt: string;
}
