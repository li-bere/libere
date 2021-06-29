// import { functions, admin, db } from "../main";

// import { PaymentStatus } from "./../utils/constants/payment-status";
// const pushNotifier = require('./../utils/push-notifier');

// export const bottleRefill = functions.https.onCall(async (data, context) => {
//   console.log("Bottle Refill called");
//   console.log(data);
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       "unauthenticated",
//       "You are not authenticated."
//     );
//   }
//   if (!data.uid || !data.shopId || !data.shopkeeperUid) {
//     throw new functions.https.HttpsError(
//       "invalid-argument",
//       "Bad data present"
//     );
//   }

//   try {
//     const userBottlesSnapshot = await db
//       .collection("bottles")
//       .where("assignee", "==", data.uid)
//       .get();
//     if (userBottlesSnapshot.empty) {
//       throw new functions.https.HttpsError(
//         "failed-precondition",
//         "You do not have any registered bottles. Please register a bottle first"
//       );
//     }

//     const userRefillsSnapshot = await db
//       .collection("transactions")
//       .where("to", "==", data.uid)
//       .where("shopId", "==", data.shopId)
//       .where("type", "==", "debit")
//       .where("reason", "==", "refill")
//       .where("createdAt", ">", admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))))
//       .where("createdAt", "<", admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(23,59,59,999))))
//       .orderBy("createdAt", "desc")
//       .get();

//       console.log('userRefillsSnapshot', userRefillsSnapshot);

//     const previousHour = new Date().getTime() - (1 * 3600 * 1000);
//     const lastHourRefills = await db
//     .collection("transactions")
//     .where("to", "==", data.uid)
//     .where("shopId", "==", data.shopId)
//     .where("type", "==", "debit")
//     .where("reason", "==", "refill")
//     .orderBy("createdAt", "desc")
//     .where("createdAt", ">", new Date(previousHour))
//     .get();

//     console.log('lastHourRefills', lastHourRefills);

    
//     const check = userBottlesSnapshot.size;
//     console.log('check', check);


//     const refillsLastHour = <any>[];
//     lastHourRefills.docs.map(async refills => {
//       // if (
//       //   doc.data().createdAt > admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))) && doc.data().createdAt < admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(23,59,59,999)))
//       // ) {
//         console.log(refills.data(), 'takla wo ');
//         refillsLastHour.push({ id: refills.id, ...refills.data() });
//       // }
//     });
    
//     const available = check - refillsLastHour.length;

//     console.log('available', available);

//     const refillsCurrentShop = [];
//     userRefillsSnapshot.docs.map(async doc => {
//       // if (
//       //   doc.data().createdAt > admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))) && doc.data().createdAt < admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(23,59,59,999)))
//       // ) {
//         console.log(doc.id, 'transaction made today');
//         refillsCurrentShop.push({ id: doc.id, ...doc.data() });
//       // }
//     });
//     console.log("user total bottles", userBottlesSnapshot.size);
//     console.log(refillsLastHour , " ghantay k refills");
//     console.log("user refills today", refillsCurrentShop.length);
//     console.log("user refill limit", userBottlesSnapshot.size * 5);
    
//       if (refillsLastHour.length > 0 || refillsCurrentShop.length >= (userBottlesSnapshot.size * 5)) {
     
//         // if (userRefillsSnapshot.size >= (userBottlesSnapshot.size * 2)) {
//           throw new functions.https.HttpsError(
//             "resource-exhausted",
//             "Your limit of today refills have been reached. Kindly try again tomorrow."
//           );
        
//       }
//       // else if( ){
//       //   throw new functions.https.HttpsError(
//       //     "resource-exhausted",
//       //     "Your limit of current hour refills have been reached. Kindly try again after some time."
//       //   );
//       // }
//     else{
//       console.log("available refill");
//     }
    
//     const feeRef = await db.collection("fees").doc("bottle-refill").get();
//     const feeData = feeRef.data();
//     if (!feeRef.exists || !feeData) {
//       throw new functions.https.HttpsError(
//         "internal",
//         "No Fee avaialble yet."
//       );
//     }
//     const fee = feeData.value;

//     let userRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
//     const userQuery = await db
//       .collection("users")
//       .where("uid", "==", data.uid)
//       .get();
//     let userData: any;
//     userQuery.forEach((doc) => {
//       userData = doc.data();
//       userData.id = doc.id;
//     });
//     userRef = db.collection("users").doc(userData.id);
//     if (!userData) {
//       throw new functions.https.HttpsError(
//         "invalid-argument",
//         "No User data found."
//       );
//     }
//     if (!userData.credit || userData.credit < fee) {
//       throw new functions.https.HttpsError(
//         "failed-precondition",
//         "You does not have Enough Credit."
//       );
//     }

//     const shopRef = db.collection("shops").doc(data.shopId);
//     const shop = await shopRef.get();
//     const shopData = shop.data();
//     if (!shopData) {
//       throw new functions.https.HttpsError(
//         "invalid-argument",
//         "No Shop data found."
//       );
//     }

//     let shopkeeperRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
//     const shopkeeperQuery = await db
//       .collection("users")
//       .where("uid", "==", data.shopkeeperUid)
//       .get();
//     let shopkeeperData: any;
//     shopkeeperQuery.forEach(function (doc) {
//       shopkeeperData = doc.data();
//       shopkeeperData.id = doc.id;
//     });
//     shopkeeperRef = db.collection("users").doc(shopkeeperData.id);
//     if (!shopkeeperData) {
//       throw new functions.https.HttpsError(
//         "invalid-argument",
//         "No Shopkeeper Data found."
//       );
//     }

//     const batch = db.batch();

//     const shopCredit = shopData.credit ? shopData.credit + fee : fee;
//     const shopkeeperCredit = shopkeeperData.credit ? shopkeeperData.credit + fee : fee;
//     const shopRefills = shopData.refills ? shopData.refills + 1 : 1;
//     batch.set(
//       shopRef,
//       {
//         credit: shopCredit,
//         refills: shopRefills,
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       },
//       { merge: true }
//     );

//     const shopCredits = shopData.credit
//       ? shopData.credit + fee
//       : fee;

//       console.log('shopCredits', shopCredits);
//     const shopkeeperRefills = shopkeeperData.refills
//       ? shopkeeperData.refills + 1
//       : 1;
//     batch.set(
//       shopkeeperRef,
//       {
//         credit: shopkeeperCredit,
//         refills: shopkeeperRefills,
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       },
//       { merge: true }
//     );
//     batch.set(
//       shopRef, {
//         credit: shopCredits
//       },
//       { merge: true }
//     )

//     const userCredit = userData.credit - fee;
//     const userRefills = userData.refills ? userData.refills + 1 : 1;
//     batch.set(
//       userRef,
//       {
//         credit: userCredit,
//         refills: userRefills,
//         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//       },
//       { merge: true }
//     );

//     const userDebitTransactionData = {
//       to: data.uid,
//       shopColor: data.shopColor,
//       type: "debit",
//       reason: "refill",
//       amount: fee,
//       description: "Bottle Refill",
//       userUid: data.uid,
//       userDisplayName: userData.firstName + ' ' + userData.lastName,
//       userName: userData.username,
//       userDisplayPhoto: userData.displayPhoto,
//       userCredits: userData.credit,
//       shopCredits: shopData.credit,
//       shopId: data.shopId,
//       shopName: shopData.name,
//       shopkeeperUid: data.shopkeeperUid,
//       shopkeeperDisplayName: shopkeeperData.firstName + ' ' + shopkeeperData.lastName,
//       shopkeeperUserName: shopkeeperData.username,
//       shopkeeperDisplayPhoto: shopkeeperData.displayPhoto,
//       status: PaymentStatus.COMPLETE,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };
//     console.log(userDebitTransactionData.shopCredits);
//     const userDebitRef = db.collection("transactions").doc();
//     batch.create(userDebitRef, userDebitTransactionData);

//     const ShopKeeperCreditTransactionData = {
//       to: data.shopkeeperUid,
//       type: "credit",
//       shopColor: data.shopColor,
//       reason: "refill",
//       amount: fee,
//       description: "Bottle Refill",
//       userUid: data.uid,
//       userDisplayName: userData.firstName + ' ' + userData.lastName,
//       userName: userData.username,
//       userDisplayPhoto: userData.displayPhoto,
//       userCredits: userData.credit,
//       shopCredits: shopData.credit,
//       shopId: data.shopId,
//       shopName: shopData.name,
//       shopkeeperUid: data.shopkeeperUid,
//       shopkeeperDisplayName: shopkeeperData.firstName + ' ' + shopkeeperData.lastName,
//       shopkeeperUserName: shopkeeperData.username,
//       shopkeeperDisplayPhoto: shopkeeperData.displayPhoto,
//       status: PaymentStatus.COMPLETE,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };
//     console.log(ShopKeeperCreditTransactionData.shopCredits);
//     const shopKeeperCreditRef = db.collection("transactions").doc();
//     batch.create(shopKeeperCreditRef, ShopKeeperCreditTransactionData);

//     // const ShopCreditTransactionData = {
//     //   to: data.shopId,
//     //   shopColor: data.shopColor,
//     //   type: "credit",
//     //   reason: "refill",
//     //   amount: fee,
//     //   description: "Bottle Refill",
//     //   userUid: data.uid,
//     //   userDisplayName: userData.firstName + ' ' + userData.lastName,
//     //   userName: userData.username,
//     //   userDisplayPhoto: userData.displayPhoto,
//     //   userCredits: userData.credit,
//     //   shopCredits: shopData.credit,
//     //   shopId: data.shopId,
//     //   shopName: shopData.name,
//     //   shopkeeperUid: data.shopkeeperUid,
//     //   shopkeeperDisplayName: shopkeeperData.firstName + ' ' + shopkeeperData.lastName,
//     //   shopkeeperUserName: shopkeeperData.username,
//     //   shopkeeperDisplayPhoto: shopkeeperData.displayPhoto,
//     //   status: PaymentStatus.COMPLETE,
//     //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     // };
//     // console.log(ShopCreditTransactionData.shopCredits);
//     // const shopCreditRef = db.collection("transactions").doc();
//     // batch.create(shopCreditRef, ShopCreditTransactionData);



//     return batch
//       .commit()
//       .then(() => {
//         if (userDebitTransactionData.userCredits < 30) {
//           console.log('this is the place where we set notification');
//         const notification = {
//           title : 'Low Credits',
//           body: `Your credits are lower than 30, please recharge`
//       }
//       const promises = [];
//       promises.push(pushNotifier.sendPushNotificationToUser(userDebitTransactionData.userUid, notification));
//       console.log('end notificaton');
//         }
//         if (shopData.credit < 30) {
//           console.log('this is the place where we set notification');
//         const notification = {
//           title : 'Low Credits',
//           body: `Credits are less than 30 in your ${shopData.name}, please recharge`
//       }
//       const promises = [];
//       promises.push(pushNotifier.sendPushNotificationToUser(ShopKeeperCreditTransactionData.shopkeeperUid, notification));
//       console.log('end notificaton');
//         }
//         return;
//       })
//       .catch(() => {
//         throw new functions.https.HttpsError(
//           "internal",
//           "Could not commit data."
//         );
//       });
//   } catch (error) {
//     throw new functions.https.HttpsError("internal", error.message);
//   }
// });



















import { functions, admin, db } from "../main";

import { PaymentStatus } from "./../utils/constants/payment-status";
const pushNotifier = require('./../utils/push-notifier');

export const bottleRefill = functions.https.onCall(async (data, context) => {
  console.log("Bottle Refill called");
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

  try {
    const userBottlesSnapshot = await db
      .collection("bottles")
      .where("assignee", "==", data.uid)
      .get();
    if (userBottlesSnapshot.empty) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You do not have any registered bottles. Please register a bottle first"
      );
    }

    const userRefillsSnapshot = await db
      .collection("transactions")
      .where("to", "==", data.uid)
      .where("shopId", "==", data.shopId)
      .where("type", "==", "debit")
      .where("reason", "==", "refill")
      // .where("createdAt", ">", admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))))
      // .where("createdAt", "<", admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(23,59,59,999))))
      .get();

    let previousHour = new Date().getTime() - (1 * 3600 * 1000);
    const lastHourRefills = await db
    .collection("transactions")
    .where("to", "==", data.uid)
    .where("shopId", "==", data.shopId)
    .where("type", "==", "debit")
    .where("reason", "==", "refill")
    .orderBy("createdAt", "desc")
    .where("createdAt", ">", new Date(previousHour))
    .get();

    
    const check = userBottlesSnapshot.size;
    console.log('check', check);


    const refillsLastHour = <any>[];
    lastHourRefills.docs.map(async refills => {
      // if (
      //   doc.data().createdAt > admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))) && doc.data().createdAt < admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(23,59,59,999)))
      // ) {
        console.log(refills.data(), 'takla wo ');
        refillsLastHour.push({ id: refills.id, ...refills.data() });
      // }
    });
    
    const available = check - refillsLastHour.length;

    console.log('available', available);

    const refillsToday = [];
    userRefillsSnapshot.docs.map(async doc => {
      // if (
      //   doc.data().createdAt > admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))) && doc.data().createdAt < admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(23,59,59,999)))
      // ) {
        console.log(doc.id, 'transaction made today');
        refillsToday.push({ id: doc.id, ...doc.data() });
      // }
    });
    // console.log("user refills", userRefillsSnapshot.size);
    console.log(refillsLastHour , " ghantay k refills");
    console.log("user refills today", refillsToday.length);
    console.log("user refill limit", userBottlesSnapshot.size * 5);
    
      if (available <= 0 || refillsToday.length >= (userBottlesSnapshot.size * 5)) {
     
        // if (userRefillsSnapshot.size >= (userBottlesSnapshot.size * 2)) {
          throw new functions.https.HttpsError(
            "resource-exhausted",
            "Your limit of refills have been reached. Kindly try again later."
          );
        
      }
    else{
      console.log("available refill");
      let stats: any;
  let userRanking: any;
  const statsSnapshot= await db.collection('stats').doc('Buy').get();
  stats=statsSnapshot.data();
  console.log('stats are', stats);
  console.log('data is ', data);
  let userRankingSnapshot= await db.collection('rankings').doc(data.uid).get();
  userRanking=userRankingSnapshot.data();
  console.log('User rankings are',userRanking);
  userRanking.dailyco2=userRanking.dailyco2+stats.co2;
  userRanking.dailypla2=userRanking.dailypla2+stats.plastic;
  userRanking.weeklypla2=userRanking.weeklypla2+stats.plastic;
  userRanking.weeklyco2=userRanking.weeklyco2+stats.co2;
  userRanking.monthlypla2=userRanking.monthlypla2+stats.plastic;
  userRanking.monthlyco2=userRanking.monthlyco2+stats.co2;
  await db.collection('rankings').doc(data.uid).set(userRanking,{merge: true})

    console.log('shop id is ',data.shopId);
    console.log('stats are', stats);
    let shopRanking: any;
    let shopRankingSnapshot= await db.collection('Shop-rankings').doc(data.shopId).get();
    shopRanking=shopRankingSnapshot.data();
    console.log('shop rankings are',shopRanking);
    shopRanking.dailyco2=shopRanking.dailyco2+stats.co2;
    shopRanking.dailypla2=shopRanking.dailypla2+stats.plastic;
    shopRanking.totalpla2=shopRanking.weeklypla2+stats.plastic;
    shopRanking.totalco2=shopRanking.weeklyco2+stats.co2;
    shopRanking.monthlypla2=shopRanking.monthlypla2+stats.plastic;
    shopRanking.monthlyco2=shopRanking.monthlyco2+stats.co2;
    await db.collection('Shop-rankings').doc(data.shopId).set(shopRanking,{merge: true})
      }

    
    
    
    const feeRef = await db.collection("fees").doc("bottle-refill").get();
    const feeData = feeRef.data();
    if (!feeRef.exists || !feeData) {
      throw new functions.https.HttpsError(
        "internal",
        "No Fee avaialble yet."
      );
    }
    const fee = feeData.value;

    let userRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
    const userQuery = await db
      .collection("users")
      .where("uid", "==", data.uid)
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
    if (!userData.credit || userData.credit < fee) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You does not have Enough Credit."
      );
    }

    const shopRef = db.collection("shops").doc(data.shopId);
    const shop = await shopRef.get();
    const shopData = shop.data();
    if (!shopData) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "No Shop data found."
      );
    }

    let shopkeeperRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
    const shopkeeperQuery = await db
      .collection("users")
      .where("uid", "==", data.shopkeeperUid)
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
        "No Shopkeeper Data found."
      );
    }

    const batch = db.batch();

    const shopCredit = shopData.credit ? shopData.credit + fee : fee;
    const shopkeeperCredit = shopkeeperData.credit ? shopkeeperData.credit + fee : fee;
    const shopRefills = shopData.refills ? shopData.refills + 1 : 1;
    batch.set(
      shopRef,
      {
        credit: shopCredit,
        refills: shopRefills,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const shopCredits = shopData.credit
      ? shopData.credit + fee
      : fee;

      console.log('shopCredits', shopCredits);
    const shopkeeperRefills = shopkeeperData.refills
      ? shopkeeperData.refills + 1
      : 1;
    batch.set(
      shopkeeperRef,
      {
        credit: shopkeeperCredit,
        refills: shopkeeperRefills,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    batch.set(
      shopRef, {
        credit: shopCredits
      },
      { merge: true }
    )

    const userCredit = userData.credit - fee;
    const userRefills = userData.refills ? userData.refills + 1 : 1;
    batch.set(
      userRef,
      {
        credit: userCredit,
        refills: userRefills,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const userDebitTransactionData = {
      to: data.uid,
      shopColor: data.shopColor,
      type: "debit",
      reason: "refill",
      amount: fee,
      description: "Bottle Refill",
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
      status: PaymentStatus.COMPLETE,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    console.log(userDebitTransactionData.shopCredits);
    const userDebitRef = db.collection("transactions").doc();
    batch.create(userDebitRef, userDebitTransactionData);

    const ShopKeeperCreditTransactionData = {
      to: data.shopkeeperUid,
      type: "credit",
      shopColor: data.shopColor,
      reason: "refill",
      amount: fee,
      description: "Bottle Refill",
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
      status: PaymentStatus.COMPLETE,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    console.log(ShopKeeperCreditTransactionData.shopCredits);
    const shopKeeperCreditRef = db.collection("transactions").doc();
    batch.create(shopKeeperCreditRef, ShopKeeperCreditTransactionData);

    // const ShopCreditTransactionData = {
    //   to: data.shopId,
    //   shopColor: data.shopColor,
    //   type: "credit",
    //   reason: "refill",
    //   amount: fee,
    //   description: "Bottle Refill",
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
    //   status: PaymentStatus.COMPLETE,
    //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
    // };
    // console.log(ShopCreditTransactionData.shopCredits);
    // const shopCreditRef = db.collection("transactions").doc();
    // batch.create(shopCreditRef, ShopCreditTransactionData);



    return batch
      .commit()
      .then(() => {
        if (userDebitTransactionData.userCredits < 30) {
          console.log('this is the place where we set notification');
        const notification = {
          title : 'Low Credits',
          body: `Your credits are lower than 30, please recharge`,
          transactionId: userDebitTransactionData,
          click_action: 'FCM_PLUGIN_ACTIVITY',
          data: {
            redirectTo: '/user-tabs/profile'
          }
      }
      const promises = [];
      promises.push(pushNotifier.sendPushNotificationToUser(userDebitTransactionData.userUid, notification));
      console.log('end notificaton');
        }
        if (shopData.credit < 30) {
          console.log('this is the place where we set notification');
        const notification = {
          title : 'Low Credits',
          body: `Credits are less than 30 in your ${shopData.name}, please recharge`,
          transactionId: ShopKeeperCreditTransactionData,
          click_action: 'FCM_PLUGIN_ACTIVITY',
          data: {
            redirectTo: '/shopkeeper-tabs/profile'
          }
      }
      const promises = [];
      promises.push(pushNotifier.sendPushNotificationToUser(ShopKeeperCreditTransactionData.shopkeeperUid, notification));
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







