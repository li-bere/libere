export interface TicketI {
  id?: string;
  uid: string;
  uType: string;
  title: string;
  description: string;
  isOpen: boolean;
  createdAt?: any;
  updatedAt: any;
}

export interface MsgI {
  id?: string;
  uid: string;
  msg: string;
  status: 'sending' | 'sent' | 'failed';
  createdAt: any;
}
