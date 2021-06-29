export interface TransactionI {
  id?: string;
  type: string;
  reason: string;
  amount: string;
  description: string;
  userName: string | null;
  userDisplayPhoto: string | null;
  shopId: string | null;
  shopName: string | null;
  shopkeeperUid: string | null;
  shopkeeperName: string | null;
  shopkeeperDisplayPhoto: string | null;
  createdAt: any;
}
