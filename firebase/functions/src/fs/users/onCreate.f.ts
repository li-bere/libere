import { EventContext } from "firebase-functions";
import { functions, db } from "../../main";
// import { PaymentStatus } from './../../utils/constants/payment-status';

async function updateUser(userData: any, userId: string) {
  const batch = db.batch();

  // let creditToAdd = 0;
  // let creditToInvitee = 0;
  // let creditToInvited = 0;
  let privateUserData = {
    firstNameCredited: false,
    lastNameCredited: false,
    dobCredited: false,
    addressCredited: false,
    phoneCredited: false,
    creditReceiveFromInvite: false
  };

  // const invitedCreditRef = await db
  // .collection("credit-quotas")
  // .doc("invited-bonus-credits")
  // .get();
  // const invitedCredits = invitedCreditRef.data();

  // const inviteeCreditRef = await db
  // .collection('credit-quotas')
  // .doc('invitee-bonus-credits')
  // .get();
  // const inviteeCredits = inviteeCreditRef.data();

  // const inviteeUserData = await db.collection('users')
  // .where('username', '==', userData.invitedFrom).get();
  // let inviteeData: any;
  // inviteeUserData.forEach(function (doc) {
  //   inviteeData = doc.data();
  // });
  // console.log(inviteeData);

  const privateUserDataRef = await db
    .collection("users")
    .doc(userId)
    .collection("private")
    .doc("credit-given")
    .get();
  privateUserData = { ...privateUserData, ...privateUserDataRef.data() };

  // Referral Credits Transactions
  // if (userData.referredBy) {
  //   const referralQuotaRef = await db
  //     .collection("credit-quotas")
  //     .doc("referral")
  //     .get();
  //   const referralData = referralQuotaRef.data();

  //   if (referralData) {
  //     creditToAdd += referralData.value;

  //     const transactionToReferrerData = {
  //       to: userId,
  //       type: "credit",
  //       reason: "referral",
  //       amount: referralData.value,
  //       description: "User Referral",
  //       userUid: userId,
  //       userName: userData.firstName + userData.lastName,
  //       userDisplayPhoto: userData.displayPhoto,
  //       shopId: null,
  //       shopName: null,
  //       shopkeeperName: null,
  //       shopkeeperDisplayPhoto: null,
  //       status: PaymentStatus.COMPLETE,
  //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     };
  //     const transactionToReferrerRef = db.collection("transactions").doc();
  //     batch.create(transactionToReferrerRef, transactionToReferrerData);

  //     const refereeQuery = await db
  //       .collection("users")
  //       .where("username", "==", userData.referredBy)
  //       .get();
  //     let refereeData: any;
  //     refereeQuery.forEach(function (doc) {
  //       refereeData = doc.data();
  //       refereeData.id = doc.id;
  //     });

  //     const transactionToRefereeData = {
  //       to: refereeData.id,
  //       type: "credit",
  //       reason: "referral",
  //       amount: referralData.value,
  //       description: "User Referral",
  //       userUid: refereeData.id,
  //       userName: refereeData.firstName + refereeData.lastName,
  //       userDisplayPhoto: refereeData.displayPhoto,
  //       shopId: null,
  //       shopName: null,
  //       shopkeeperName: null,
  //       shopkeeperDisplayPhoto: null,
  //       status: PaymentStatus.COMPLETE,
  //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     };
  //     const transactionToRefereeRef = db.collection("transactions").doc();
  //     batch.create(transactionToRefereeRef, transactionToRefereeData);

  //     const refereeRef = db.collection("users").doc(refereeData.id);
  //     batch.set(
  //       refereeRef,
  //       { credit: refereeData.credit + referralData.value },
  //       { merge: true }
  //     );
  //   }
  // }

  // if (userData.firstName && !privateUserData.firstNameCredited) {
  //   const dataRef = await db
  //     .collection("credit-quotas")
  //     .doc("profile-completion-firstName")
  //     .get();
  //   const data = dataRef.data();
  //   if (data) {
  //     creditToAdd += data.value;

  //     privateUserData.firstNameCredited = true;

  //     const transactionData = {
  //       to: userId,
  //       type: "credit",
  //       reason: "profile-completion-firstName",
  //       amount: data.value,
  //       description: "Profile Completion First Name",
  //       userUid: userId,
  //       userName: userData.firstName + userData.lastName,
  //       userDisplayPhoto: userData.displayPhoto,
  //       shopId: null,
  //       shopName: null,
  //       shopkeeperName: null,
  //       shopkeeperDisplayPhoto: null,
  //       status: PaymentStatus.COMPLETE,
  //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     };
  //     const transactionRef = db.collection("transactions").doc();
  //     batch.create(transactionRef, transactionData);
  //   }
  // }

  // if (userData.lastName && !privateUserData.lastNameCredited) {
  //   const dataRef = await db
  //     .collection("credit-quotas")
  //     .doc("profile-completion-lastName")
  //     .get();
  //   const data = dataRef.data();
  //   if (data) {
  //     creditToAdd += data.value;

  //     privateUserData.lastNameCredited = true;

  //     const transactionData = {
  //       to: userId,
  //       type: "credit",
  //       reason: "profile-completion-lastName",
  //       amount: data.value,
  //       description: "Profile Completion Last Name",
  //       userUid: userId,
  //       userName: userData.firstName + " " + userData.lastName,
  //       userDisplayPhoto: userData.displayPhoto,
  //       shopId: null,
  //       shopName: null,
  //       shopkeeperName: null,
  //       shopkeeperDisplayPhoto: null,
  //       status: PaymentStatus.COMPLETE,
  //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     };
  //     const transactionRef = db.collection("transactions").doc();
  //     batch.create(transactionRef, transactionData);
  //   }
  // }

  // if (userData.dob && !privateUserData.dobCredited) {
  //   const dataRef = await db
  //     .collection("credit-quotas")
  //     .doc("profile-completion-dob")
  //     .get();
  //   const data = dataRef.data();
  //   if (data) {
  //     creditToAdd += data.value;

  //     privateUserData.dobCredited = true;

  //     const transactionData = {
  //       to: userId,
  //       type: "credit",
  //       reason: "profile-completion-dob",
  //       amount: data.value,
  //       description: "Profile Completion Date of Birth",
  //       userUid: userId,
  //       userName: userData.firstName + " " + userData.lastName,
  //       userDisplayPhoto: userData.displayPhoto,
  //       shopId: null,
  //       shopName: null,
  //       shopkeeperName: null,
  //       shopkeeperDisplayPhoto: null,
  //       status: PaymentStatus.COMPLETE,
  //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     };
  //     const transactionRef = db.collection("transactions").doc();
  //     batch.create(transactionRef, transactionData);
  //   }
  // }

  // if (userData.address && !privateUserData.addressCredited) {
  //   const dataRef = await db
  //     .collection("credit-quotas")
  //     .doc("profile-completion-address")
  //     .get();
  //   const data = dataRef.data();
  //   if (data) {
  //     creditToAdd += data.value;

  //     privateUserData.addressCredited = true;

  //     const transactionData = {
  //       to: userId,
  //       type: "credit",
  //       reason: "profile-completion-address",
  //       amount: data.value,
  //       description: "Profile Completion Address",
  //       userUid: userId,
  //       userName: userData.firstName + userData.lastName,
  //       userDisplayPhoto: userData.displayPhoto,
  //       shopId: null,
  //       shopName: null,
  //       shopkeeperName: null,
  //       shopkeeperDisplayPhoto: null,
  //       status: PaymentStatus.COMPLETE,
  //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     };
  //     const transactionRef = db.collection("transactions").doc();
  //     batch.create(transactionRef, transactionData);
  //   }
  // }

  // if (userData.phone && !privateUserData.phoneCredited) {
  //   const dataRef = await db
  //     .collection("credit-quotas")
  //     .doc("profile-completion-phone")
  //     .get();
  //   const data = dataRef.data();
  //   if (data) {
  //     creditToAdd += data.value;

  //     privateUserData.phoneCredited = true;

  //     const transactionData = {
  //       to: userId,
  //       type: "credit",
  //       reason: "profile-completion-phone",
  //       amount: data.value,
  //       description: "Profile Completion Phone",
  //       userUid: userId,
  //       userName: userData.firstName + userData.lastName,
  //       userDisplayPhoto: userData.displayPhoto,
  //       shopId: null,
  //       shopName: null,
  //       shopkeeperName: null,
  //       shopkeeperDisplayPhoto: null,
  //       status: PaymentStatus.COMPLETE,
  //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     };
  //     const transactionRef = db.collection("transactions").doc();
  //     batch.create(transactionRef, transactionData);
  //   }
  // }

  // if (userData.invitedFrom && invitedCredits && inviteeCredits ) {

  //   console.log(userData.invitedFrom);

  //   if (invitedCredits || inviteeCredits) {
  //       const invitedTransactionData = {
  //       to: userId,
  //       type: "credit",
  //       reason: "Invited bonus credits",
  //       amount: invitedCredits.value,
  //       description: "Invited",
  //       userUid: userId,
  //       userName: userData.firstName + userData.lastName,
  //       userDisplayPhoto: userData.displayPhoto,
  //       shopId: null,
  //       shopName: null,
  //       shopkeeperName: null,
  //       shopkeeperDisplayPhoto: null,
  //       status: PaymentStatus.COMPLETE,
  //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     };
      
  //     const invitedTransactionRef = db.collection("transactions").doc();
  //     batch.create(invitedTransactionRef, invitedTransactionData);

  //       const inviteeTransactionData = {
  //       to: inviteeData.uid,
  //       type: "credit",
  //       reason: "Invitee bonus credits",
  //       amount: inviteeCredits.value,
  //       description: "Invitee",
  //       userUid: inviteeData.uid,
  //       userName: inviteeData.firstName + inviteeData.lastName,
  //       userDisplayPhoto: inviteeData.displayPhoto,
  //       shopId: null,
  //       shopName: null,
  //       shopkeeperName: null,
  //       shopkeeperDisplayPhoto: null,
  //       status: PaymentStatus.COMPLETE,
  //       createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     }
  //     const inviteeTransactionRef = db.collection("transactions").doc();
  //     batch.create(inviteeTransactionRef, inviteeTransactionData);

  //     const invitedNewCredits = userData.credit ? userData.credit + inviteeCredits.value : inviteeCredits.value;
  //     console.log('final invitedNewCredits', invitedNewCredits)
    
  //     const inviteeNewCredits = inviteeData.credit + inviteeCredits.value;
  //     // ? inviteeData.credit + creditToInvitee : creditToInvitee;
  //     console.log('final inviteeNewCredits', inviteeNewCredits);

  //     const invitedRef = db.collection("users").doc(userData.uid);
  //     batch.set(invitedRef, { credit: invitedNewCredits }, { merge: true });
    
  //     const inviteeRef = db.collection("users").doc(inviteeData.uid);
  //     batch.set(inviteeRef, { credit: inviteeNewCredits }, { merge: true });
  //   }
    
  // }



  // const newCredit = userData.credit
  //   ? userData.credit + creditToAdd
  //   : creditToAdd;

  //   console.log('newCredit', newCredit);
  
  // const invitedNewCredits = userData.credit = creditToInvited;
  // // ? userData.credit + creditToInvited : creditToInvited;
  // console.log('final invitedNewCredits', invitedNewCredits)

  // const inviteeNewCredits = inviteeData.credit = creditToInvitee;
  // // ? inviteeData.credit + creditToInvitee : creditToInvitee;
  // console.log('final inviteeNewCredits', inviteeNewCredits);

  // const userRef = db.collection("users").doc(userId);
  // batch.set(userRef, { credit: newCredit }, { merge: true });

  // const invitedRef = db.collection("users").doc(userData.uid);
  // batch.set(invitedRef, { credit: invitedNewCredits }, { merge: true });

  // const inviteeRef = db.collection("users").doc(inviteeData.uid);
  // batch.set(inviteeRef, { credit: inviteeNewCredits }, { merge: true });

  const privateUserRef = db
    .collection("users")
    .doc(userId)
    .collection("private")
    .doc("credit-given");
  batch.set(privateUserRef, privateUserData);

  return batch.commit();
}

export const onCreate = functions.firestore
  .document("/users/{userId}")
  .onCreate(
    (
      snapshot: functions.firestore.QueryDocumentSnapshot,
      context: EventContext
    ) => {
      const data = snapshot.data();
      const userId = context.params.userId;

      return updateUser(data, userId);
    }
  );
