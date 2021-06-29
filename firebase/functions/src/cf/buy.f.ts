import { PaymentStatus } from "./../utils/constants/payment-status";
import { functions, admin, db } from "../main";
const pushNotifier = require('./../utils/push-notifier');

const crypto = require('crypto');

export const buy = functions.https.onCall(async (data, context) => {
  console.log("Buy called");
  console.log('data', data);
  
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You are not authenticated."
    );
  }

  if (!data.uid || !data.shopId || !data.shopkeeperUid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Bad data present"
    );
  }

  // const shopSnapshot = await db
  //     .collection("transactions")
  //     .doc(data.shopId)
  //     .get();
  //   const checkShopCredits = shopSnapshot.data();
    
  // if (checkShopCredits) {
  //   if (checkShopCredits.credit === 0) {
  //     throw new functions.https.HttpsError(
  //       "invalid-argument",
  //       "Shop has 0 credits you can't buy from this shop."
  //     );
  //   }
  // }


  try {
    const userBottlesSnapshot = await db
    .collection("bottles")
    .where("assignee", "==", data.uid)
    .get();

    const userBuysSnapshot = await db
      .collection("transactions")
      .where("to", "==", data.uid)
      .where("shopId", "==", data.shopId)
      .where("type", "==", "credit")
      .where("reason", "==", "buy")
      .where("createdAt", ">", new Date(new Date().setHours(0, 0, 0, 0)))
      .where("createdAt", "<", new Date(new Date().setHours(23, 59, 59, 999)))
      .orderBy("createdAt", "desc")
      .get();

      let previousHour = new Date().getTime() - (1 * 3600 * 1000);
      const lastHourRefills = await db
      .collection("transactions")
      .where("to", "==", data.uid)
      .where("shopId", "==", data.shopId)
      .where("type", "==", "credit")
      .where("reason", "==", "buy")
      .orderBy("createdAt", "desc")
      .where("createdAt", ">", new Date(previousHour))
      .get();

      const lastHourRejected = await db
      .collection("transactions")
      .where("to", "==", data.uid)
      .where("status", "==" , "REJECTED")
      .where("shopId", "==", data.shopId)
      .where("type", "==", "credit")
      .where("reason", "==", "buy")
      .orderBy("createdAt", "desc")
      .where("createdAt", ">", new Date(previousHour))
      .get();

      const buysLastHour = <any>[];
      lastHourRefills.docs.map(async buys => {
        // if (
        //   doc.data().createdAt > admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))) && doc.data().createdAt < admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(23,59,59,999)))
        // ) {
          console.log(buys.data(), 'takla wo ');
          buysLastHour.push({ id: buys.id, ...buys.data() });
        // }
      });

    const buysCurrentShop = [];

    userBuysSnapshot.docs.map(async doc => {
      // if (
      //   doc.data().createdAt > admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))) && doc.data().createdAt < admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(23,59,59,999)))
      // ) {
        console.log(doc.id, 'transaction made today');
        buysCurrentShop.push({ id: doc.id, ...doc.data() });
      // }
    });

    // console.log("user buys", userBuysSnapshot.size);
    console.log("user buys today", buysCurrentShop.length);
    const acceptedTransactions=buysLastHour.length-lastHourRejected.size;
    if (acceptedTransactions > 0 || buysCurrentShop.length >= (userBottlesSnapshot.size * 5)) {
    // if (userBuysSnapshot.size >= 2) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Your limit of refills have been reached. Kindly try again later."
      );
    }

    let buyCredit = 0;
    const dataRef = await db.collection("credit-quotas").doc("buy").get();
    const creditData = dataRef.data();
    if (creditData && creditData.value && creditData.value > 0) {
      buyCredit = creditData.value;
    } else {
      throw new functions.https.HttpsError(
        "internal",
        "No valid credit set for buy."
      );
    }

    const shopkeeperQuery = await db
      .collection("users")
      .where("uid", "==", data.shopkeeperUid)
      .get();
    let shopkeeperData: any;
    shopkeeperQuery.forEach(function (doc) {
      shopkeeperData = doc.data();
      shopkeeperData.id = doc.id;
    });
    if (!shopkeeperData) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "No Shopkeeper data found."
      );
    }

    const userQuery = await db
      .collection("users")
      .where("uid", "==", data.uid)
      .get();
    let userData: any;
    userQuery.forEach((doc) => {
      userData = doc.data();
      userData.id = doc.id;
    });
    if (!userData) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "No User data found."
      );
    }

    const shopRef = db.collection("shops").doc(data.shopId);
    const shop = await shopRef.get();
    const shopData = shop.data();
    if (!shopData) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "No shop data found."
      );
    }

    const batch = db.batch();
    const transactionGroup = crypto.randomBytes(28).toString('hex');

    const shopKeeperDebitTransactionData = {
      to: data.shopkeeperUid,
      shopColor: data.shopColor,
      transactionGroup,
      type: "debit",
      reason: "buy",
      amount: buyCredit,
      description: "Buy",
      userUid: data.uid,
      userDisplayName: userData.firstName + ' ' + userData.lastName,
      userName: userData.username,
      userDisplayPhoto: userData.displayPhoto,
      userCredits: userData.credit,
      shopCredits: shopData.credit,
      shopId: data.shopId,
      shopName: shopData.name,
      shopDisplayPicture: shopData.shopDisplayPhoto,
      shopkeeperUid: data.shopkeeperUid,
      shopkeeperDisplayName: shopkeeperData.firstName + ' ' + shopkeeperData.lastName,
      shopkeeperUserName: shopkeeperData.username,
      shopkeeperDisplayPhoto: shopkeeperData.displayPhoto,
      status: PaymentStatus.PENDING,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const shopkeeperDebitRef = db.collection("transactions").doc();
    batch.create(shopkeeperDebitRef, shopKeeperDebitTransactionData);

    // const shoptDebitTransactionData = {
    //   to: data.shopId,
    //   shopColor: data.shopColor,
    //   transactionGroup,
    //   type: "debit",
    //   reason: "buy",
    //   amount: buyCredit,
    //   description: "Buy",
    //   userUid: data.uid,
    //   userDisplayName: userData.firstName + ' ' + userData.lastName,
    //   userName: userData.username,
    //   userDisplayPhoto: userData.displayPhoto,
    //   userCredits: userData.credit,
    //   shopCredits: shopData.credit,
    //   shopId: data.shopId,
    //   shopName: shopData.name,
    //   shopkeeperUid: data.shopkeeperUid,
    //   shopkeeperDisplayName: shopkeeperData.firstName + ' ' + shopkeeperData.lastName,
    //   shopkeeperUserName: shopkeeperData.username,
    //   shopkeeperDisplayPhoto: shopkeeperData.displayPhoto,
    //   status: PaymentStatus.PENDING,
    //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
    // };
    // const shopDebitRef = db.collection("transactions").doc();
    // batch.create(shopDebitRef, shoptDebitTransactionData);

    const userCreditTransactionData = {
      to: data.uid,
      shopColor: data.shopColor,
      transactionGroup,
      type: "credit",
      reason: "buy",
      amount: buyCredit,
      description: "Buy",
      userUid: data.uid,
      userDisplayName: userData.firstName + ' ' + userData.lastName,
      userName: userData.username,
      userDisplayPhoto: userData.displayPhoto,
      userCredits: userData.credit,
      shopCredits: shopData.credit,
      shopId: data.shopId,
      shopName: shopData.name,
      shopDisplayPicture: shopData.shopDisplayPhoto,
      shopkeeperUid: data.shopkeeperUid,
      shopkeeperDisplayName: shopkeeperData.firstName + ' ' + shopkeeperData.lastName,
      shopkeeperUserName: shopkeeperData.username,
      shopkeeperDisplayPhoto: shopkeeperData.displayPhoto,
      status: PaymentStatus.PENDING,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const userCreditRef = db.collection("transactions").doc();
    batch.create(userCreditRef, userCreditTransactionData);

    return batch
      .commit()
      .then(() => {
        console.log('this is the place where we set notification');
        const notification = {
          title : 'Buy Request',
          body: `New buy request for your ${shopKeeperDebitTransactionData.shopName}`,
          transactionId: shopKeeperDebitTransactionData,
          click_action: 'FCM_PLUGIN_ACTIVITY',
          data: {
            redirectTo: '/shopkeeper-tabs/transactions'
          }
      }
      const promises = [];
      promises.push(pushNotifier.sendPushNotificationToUser(userCreditTransactionData.shopkeeperUid, notification));
      console.log('end notificaton');

      if (userCreditTransactionData.userCredits < 30) {
        console.log('this is the place where we set notification');
      const checkNotification = {
        title : 'Low Credits',
        body: `Your credits are lower than 30, please recharge`,
        transactionId: userCreditTransactionData,
        click_action: 'FCM_PLUGIN_ACTIVITY',
        data: {
          redirectTo: '/user-tabs/profile'
        }
    }
      const promise = [];
    promise.push(pushNotifier.sendPushNotificationToUser(userCreditTransactionData.userUid, checkNotification));
    console.log('end notificaton');
      }
      if (shopData.credit < 30) {
        console.log('this is the place where we set notification');
      const checkNotification = {
        title : 'Low Credits',
        body: `Credits are less than 30 in your ${shopData.name}, please recharge`,
        transactionId: shopKeeperDebitTransactionData,
        click_action: 'FCM_PLUGIN_ACTIVITY',
        data: {
          redirectTo: '/shopkeeper-tabs/profile'
        }
    }
      const promise = [];
    promise.push(pushNotifier.sendPushNotificationToUser(shopKeeperDebitTransactionData.shopkeeperUid, checkNotification));
    console.log('end notificaton');
      }
        return;
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
