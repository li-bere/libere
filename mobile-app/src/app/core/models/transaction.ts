export interface TransactionI {
  id?: string;
  Role?: string| null;
  to: string;
  type: string;
  reason: string;
  amount: number;
  description: string;
  userUid: string | null;
  userDisplayName: string | null;
  userName: string | null;
  userDisplayPhoto: string | null;
  userCredits: number;
  shopId: string | null;
  shopName: string | null;
  shopDisplayPicture: string | null;
  shopkeeperUid: string | null;
  shopkeeperDisplayName: string | null;
  shopkeeperUserName: string | null;
  shopkeeperDisplayPhoto: string | null;
  shopCredits: number;
  status: string;
  createdAt: any;
  shopColor: string;
}
