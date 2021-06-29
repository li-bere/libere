import { EventContext } from "firebase-functions";

import { functions, admin, db } from "../../main";
import { PaymentStatus } from './../../utils/constants/payment-status';

async function updateUser(newValue: any, oldValue: any, userId: string) {
  const batch = db.batch();
  let creditToAdd = 0;
  let privateUserData = {
    firstNameCredited: false,
    lastNameCredited: false,
    dobCredited: false,
    addressCredited: false,
    phoneCredited: false,
    creditReceiveFromInvite: false
  };

  const privateUserDataRef = await db
    .collection("users")
    .doc(userId)
    .collection("private")
    .doc("credit-given")
    .get();
  // let privateUserData = privateUserDataRef.data();
  privateUserData = {...privateUserData, ...privateUserDataRef.data()};

  if (
    !oldValue.firstName &&
    newValue.firstName &&
    !privateUserData.firstNameCredited
  ) {
    const dataRef = await db.collection("credit-quotas").doc("profile-completion-firstName").get();
    const data = dataRef.data();
    if(data) {
      creditToAdd += data.value;

      privateUserData.firstNameCredited = true;

      const transactionData = {
        to: userId,
        type: "credit",
        reason: "profile-completion-firstName",
        amount: data.value,
        description: "Profile Completion First Name",
        userUid: userId,
        userName: newValue.firstName + newValue.lastName,
        userDisplayPhoto: newValue.displayPhoto,
        shopId: null,
        shopName: null,
        shopkeeperName: null,
        shopkeeperDisplayPhoto: null,
        status: PaymentStatus.COMPLETE,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      const transactionRef = db.collection("transactions").doc();
      batch.create(transactionRef, transactionData);
    }
  }

  if (
    !oldValue.lastName &&
    newValue.lastName &&
    !privateUserData.lastNameCredited
  ) {
    const dataRef = await db.collection("credit-quotas").doc("profile-completion-lastName").get();
    const data = dataRef.data();
    if(data) {
      creditToAdd += data.value;

      privateUserData.lastNameCredited = true;

      const transactionData = {
        to: userId,
        type: "credit",
        reason: "profile-completion-lastName",
        amount: data.value,
        description: "Profile Completion Last Name",
        userUid: userId,
        userName: newValue.firstName + newValue.lastName,
        userDisplayPhoto: newValue.displayPhoto,
        shopId: null,
        shopName: null,
        shopkeeperName: null,
        shopkeeperDisplayPhoto: null,
        status: PaymentStatus.COMPLETE,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      const transactionRef = db.collection("transactions").doc();
      batch.create(transactionRef, transactionData);
    }
  }

  if (
    !oldValue.dob &&
    newValue.dob &&
    !privateUserData.dobCredited
  ) {
    const dataRef = await db.collection("credit-quotas").doc("profile-completion-dob").get();
    const data = dataRef.data();
    if(data) {
      creditToAdd += data.value;

      privateUserData.dobCredited = true;

      const transactionData = {
        to: userId,
        type: "credit",
        reason: "profile-completion-dob",
        amount: data.value,
        description: "Profile Completion Date of Birth",
        userUid: userId,
        userName: newValue.firstName + newValue.lastName,
        userDisplayPhoto: newValue.displayPhoto,
        shopId: null,
        shopName: null,
        shopkeeperName: null,
        shopkeeperDisplayPhoto: null,
        status: PaymentStatus.COMPLETE,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      const transactionRef = db.collection("transactions").doc();
      batch.create(transactionRef, transactionData);
    }
  }

  if (
    !oldValue.address &&
    newValue.address &&
    !privateUserData.addressCredited
  ) {
    const dataRef = await db.collection("credit-quotas").doc("profile-completion-address").get();
    const data = dataRef.data();
    if(data) {
      creditToAdd += data.value;

      privateUserData.addressCredited = true;

      const transactionData = {
        to: userId,
        type: "credit",
        reason: "profile-completion-address",
        amount: data.value,
        description: "Profile Completion Address",
        userUid: userId,
        userName: newValue.firstName + newValue.lastName,
        userDisplayPhoto: newValue.displayPhoto,
        shopId: null,
        shopName: null,
        shopkeeperName: null,
        shopkeeperDisplayPhoto: null,
        status: PaymentStatus.COMPLETE,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      const transactionRef = db.collection("transactions").doc();
      batch.create(transactionRef, transactionData);
    }
  }

  if (
    !oldValue.phone &&
    newValue.phone &&
    !privateUserData.phoneCredited
  ) {
    const dataRef = await db.collection("credit-quotas").doc("profile-completion-phone").get();
    const data = dataRef.data();
    if(data) {
      creditToAdd += data.value;

      privateUserData.phoneCredited = true;

      const transactionData = {
        to: userId,
        type: "credit",
        reason: "profile-completion-phone",
        amount: data.value,
        description: "Profile Completion Phone",
        userUid: userId,
        userName: newValue.firstName + newValue.lastName,
        userDisplayPhoto: newValue.displayPhoto,
        shopId: null,
        shopName: null,
        shopkeeperName: null,
        shopkeeperDisplayPhoto: null,
        status: PaymentStatus.COMPLETE,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      const transactionRef = db.collection("transactions").doc();
      batch.create(transactionRef, transactionData);
    }
  }




  const newCredit = newValue.credit ?  newValue.credit + creditToAdd : creditToAdd;

  const userRef = db.collection("users").doc(userId);
  batch.set(userRef, { credit: newCredit }, { merge: true });

  const privateUserRef = db.collection("users").doc(userId).collection('private').doc('credit-given');
  batch.set(privateUserRef, privateUserData);

  return batch.commit();
}

export const onUpdate = functions.firestore
  .document("/users/{userId}")
  .onUpdate((change, context: EventContext) => {
    const newValue = change.after.data();
    const oldValue = change.before.data();
    const userId = context.params.userId;

    return updateUser(newValue, oldValue, userId);
  });
