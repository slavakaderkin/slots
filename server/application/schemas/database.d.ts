interface Account {
  phone?: string;
  tg?: string;
  info?: string;
  registered: string;
  lastSeen: string;
  isBanned: boolean;
  timezone?: string;
  accountId?: string;
}

interface Profile {
  accountId: string;
  name: string;
  description: string;
  city?: string;
  address?: string;
  termLink?: string;
  isActive: boolean;
  category: string;
  specialization?: string;
  balance: string;
  slotDuration: number;
  profileId?: string;
}

interface Client {
  accountId: string;
  profileId: string;
  isBanned: boolean;
  clientId?: string;
}

interface Slot {
  datetime: string;
  profileId: string;
  isAvailable: boolean;
  isBlocked: boolean;
  slotId?: string;
}

interface Service {
  profileId: string;
  name: string;
  description?: string;
  price: string;
  isOnline: boolean;
  allDay: boolean;
  isVisits: boolean;
  autoConfirm: boolean;
  state: string;
  duration?: number;
  serviceId?: string;
}

interface Booking {
  profileId: string;
  clientId: string;
  slotId: string;
  datetime: string;
  serviceId: string;
  duration?: number;
  allDay: boolean;
  isPaid: boolean;
  state: string;
  createdAt: string;
  comment?: string;
  bookingId?: string;
}

interface Category {
  name: string;
  parentId?: string;
  categoryId?: string;
}

interface Employee {
  profileId: string;
  accountId: string;
  state: string;
  employeeId?: string;
}

interface Feedback {
  profileId: string;
  accountId: string;
  serviceId?: string;
  employeeId?: string;
  bookingId: string;
  isAnonymous: boolean;
  rating: number;
  text?: string;
  date: string;
  feedbackId?: string;
}

interface PaymentProvider {
  name: string;
  token: string;
  profileId: string;
  paymentProviderId?: string;
}

interface Session {
  token: string;
  accountId: string;
  ip: string;
  data: string;
  sessionId?: string;
}

interface Subscription {
  accountId: string;
  profileId: string;
  start: string;
  end: string;
  type: string;
  level: string;
  isActive: boolean;
  subscriptionId?: string;
}

interface SubPayment {
  subscriptionId: string;
  date: string;
  amount: string;
  state: string;
  subPaymentId?: string;
}

interface Trial {
  accountId: string;
  start: string;
  end: string;
  isExpired: boolean;
  trialId?: string;
}
