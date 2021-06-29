import { functions, db, admin } from "../main";
import { PaymentStatus } from "../utils/constants/payment-status";
const pushNotifier = require('./../utils/push-notifier');

export const transferCredits = functions.https.onCall(async (data, context) => {
  console.log(data);
  console.log(context);
  const batch = db.batch();
  
  try {
    const userQuery = await db
    .collection("users")
    .where("username", "==", data.userName)
    .get();
    let userData: any;
    userQuery.forEach((doc) => {
      userData = doc.data();
    });
    console.log('user data is', userData);

    if (!userData) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "No user found of that username."
      );
    }

    const userProfileRef = db.collection('users').doc(userData.uid);
    const shopkeeperProfileRef = db.collection('users').doc(data.shopkeeperId);
      
    console.log(data.shopkeeperId);
    const shopKeeperDoc = await shopkeeperProfileRef.get();
    const shopkeeperData = shopKeeperDoc.data();
    console.log('shopkeeper data is', shopkeeperData);
    if (!shopkeeperData) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "No shopkeeper data found of that id."
      );
    }

    if(shopkeeperData.credit < data.credits) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You do not have enough credit for this transaction."
      );
    }

    let newCreditsForUser = userData.credit ? userData.credit + data.credits : data.credits;
    let newCreditsForShopkeeper = shopkeeperData.credit - data.credits;
    console.log('newCreditsForUser', newCreditsForUser);
    console.log('newCreditsForShopkeeper', newCreditsForShopkeeper);

    const userCreditTransaction = {
      to: userData.uid,
      type: "credit",
      reason: "credit transfering",
      amount: data.credits,
      description: "Fund Transfer",
      userUid: userData.uid,
      userName: userData.firstName + userData.lastName,
      userDisplayPhoto: userData.displayPhoto,
      shopkeeperUid: shopkeeperData.uid, 
      shopkeeperName: shopkeeperData.firstName + shopkeeperData.lastName,
      shopkeeperDisplayPhoto: shopkeeperData.displayPhoto,
      status: PaymentStatus.COMPLETE,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }
    const userTransactionRef = db.collection("transactions").doc();
    batch.create(userTransactionRef, userCreditTransaction);

    const shopkeeperDebitTransaction = {
      to: shopkeeperData.uid,
      type: "debit",
      reason: "credit transfering",
      amount: data.credits,
      description: "fund transfer",
      userUid: userData.uid,
      userName: userData.firstName + userData.lastName,
      userDisplayPhoto: userData.displayPhoto,
      shopkeeperUid: shopkeeperData.uid, 
      shopkeeperName: shopkeeperData.firstName + shopkeeperData.lastName,
      shopkeeperDisplayPhoto: shopkeeperData.displayPhoto,
      status: PaymentStatus.COMPLETE,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }
    const shopkeeperTransactionRef = db.collection("transactions").doc();
    batch.create(shopkeeperTransactionRef, shopkeeperDebitTransaction);

    batch.update(userProfileRef, { credit: newCreditsForUser });
    batch.update(shopkeeperProfileRef, { credit: newCreditsForShopkeeper });

    return batch.commit()
    .then(() => {
      const notification = {
        title : 'Funds Transfered',
        body: `${shopkeeperData.firstName + ' ' + shopkeeperData.lastName} has transfered ${ data.credits } to you`,
        click_action: 'FCM_PLUGIN_ACTIVITY',
        data: {
          redirectTo: '/user-tabs/profile'
        }
    }
    const promises = [];
    promises.push(pushNotifier.sendPushNotificationToUser(userData.uid, notification));
    })
    .catch(() => {
      throw new functions.https.HttpsError(
        "internal",
        "Could not commit data."
      );
    });

  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }

});
