import { PaymentStatus } from "./../utils/constants/payment-status";
import { functions, db, admin } from "../main";
const pushNotifier = require('./../utils/push-notifier');

export const buyAcceptSchedule = functions.pubsub.schedule('every 1440 minutes')
    .onRun(async (context) => {
    console.log('this will be run every day eastern', context);
    
    try {
      let previous = new Date().getTime() - (15 * 24 * 3600 * 1000);
      const transactionSnapshot = await db
      .collection("transactions")
        .where('status', '==', 'PENDING')
        .where('createdAt' , '<=' , new Date(previous))
        .get();
        let transactionData: any;
        transactionSnapshot.forEach((doc) => {
            transactionData = doc.data();
        });
      if (!transactionData) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "No Transaction data found."
        );
      }
      if (transactionData.status !== PaymentStatus.PENDING) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Status of this transaction cannot be changed."
        );
      }
  
      const batch = db.batch();
  
      // if (data.isAccepted) {
        const buyCredit = transactionData.amount;
        console.log("buyCredit", buyCredit);
  
        let shopkeeperRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
        const shopkeeperQuery = await db
          .collection("users")
          .where("uid", "==", transactionData.shopkeeperUid)
          .get();
        let shopkeeperData: any;
        shopkeeperQuery.forEach(function (doc) {
          shopkeeperData = doc.data();
          shopkeeperData.id = doc.id;
        });
        shopkeeperRef = db.collection("users").doc(shopkeeperData.id);
        if (!shopkeeperData) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "No Shopkeeper data found."
          );
        }
        if (shopkeeperData.credit < buyCredit) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            "You does not have enough credit."
          );
        }
  
        let userRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
        const userQuery = await db
          .collection("users")
          .where("uid", "==", transactionData.userUid)
          .get();
        let userData: any;
        userQuery.forEach((doc) => {
          userData = doc.data();
          userData.id = doc.id;
        });
        userRef = db.collection("users").doc(userData.id);
        if (!userData) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "No User data found."
          );
        }
  
        const shopRef = db.collection("shops").doc(transactionData.shopId);
        const shop = await shopRef.get();
        const shopData = shop.data();
        if (!shopData) {
          throw new functions.https.HttpsError(
            "invalid-argument",
            "No shop data found."
          );
        }
        const shopCredit = shopData.credit
          ? shopData.credit - buyCredit
          : 0;
        console.log("shopCredit", shopCredit);
        const shopBuys = shopData.buys ? shopData.buys + 1 : 1;
        batch.set(
          shopRef,
          {
            credit: shopCredit,
            buys: shopBuys,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
  
        const shopkeeperCredit = shopkeeperData.credit - buyCredit;
        console.log("shopkeeperCredit", shopkeeperCredit);
        const shopkeeperBuys = shopkeeperData.buys ? shopkeeperData.buys + 1 : 1;
        batch.set(
          shopkeeperRef,
          {
            credit: shopkeeperCredit,
            buys: shopkeeperBuys,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
  
        const userCredit = userData.credit
          ? userData.credit + buyCredit
          : buyCredit;
        console.log("userCredit", userCredit);
        const userBuys = userData.buys ? userData.buys + 1 : 1;
        batch.set(
          userRef,
          {
            credit: userCredit,
            buys: userBuys,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
  
        const transactions = await db
          .collection("transactions")
          .where("transactionGroup", "==", transactionData.transactionGroup)
          .get();
        transactions.forEach((transaction) => {
          batch.set(
            transaction.ref,
            { status: PaymentStatus.COMPLETE },
            { merge: true }
          );
        });
  
        console.log('this is the place where we set notification');
        const notification = {
          title : 'Buy Bottle Request',
          body: `Your request has been accepted`,
          transactionId: transactionData,
          click_action: 'FCM_PLUGIN_ACTIVITY',
          data: {
            redirectTo: '/user-tabs/transactions'
          }
      }
      const promises = [];
      promises.push(pushNotifier.sendPushNotificationToUser(transactionData.userUid, notification));
      console.log('end notificaton');
  
      return batch
        .commit()
        .then(() => {
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

