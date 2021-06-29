import { EventContext } from "firebase-functions";

import { functions, db, admin } from "../../main";
import { PaymentStatus } from "./../../utils/constants/payment-status";

async function transferShopCreationCredits(shopData: any, shopId: string) {
  try {
    const batch = db.batch();

  // let creditToAdd = 0;
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
    .doc(shopData.shopkeeperUid)
    .collection("private")
    .doc("credit-given")
    .get();
  // let privateUserData = privateUserDataRef.data();
  privateUserData = {...privateUserData, ...privateUserDataRef.data()};

    const userRef = await db
      .collection("users")
      .doc(shopData.shopkeeperUid);

      
    const shopRef = await db
    .collection('shops')
    .doc(shopId);

  
    const shopSnap = await 
      shopRef
      .get(); 
    const dataOfShop = shopSnap.data();
    if (!dataOfShop) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "No Shop Data found"
      );
    }

    const invitedUserData = await db
      .collection("users")
      .where("uid", "==", shopData.shopkeeperUid)
      .get();
    let invitedData: any;
    invitedUserData.forEach((doc) => {
      invitedData = doc.data();
    });
    console.log('invited user data', invitedData);


    
    const userSnap = await 
    userRef
    .get(); 
  const userData = userSnap.data();
  if (!userData) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "No User Data found"
    );
  } 

    const shopCreationQuotaRef = await db
    .collection("credit-quotas")
    .doc("shop-creation")
    .get();
    const shopCreationQuotaData = shopCreationQuotaRef.data();

    if(!shopCreationQuotaData) {
      throw new functions.https.HttpsError(
        "internal",
        "No credit quota found for shop creation"
      );
    }

    batch.set(shopRef, { credit: shopCreationQuotaData.value }, { merge: true });
    batch.update(userRef, {credit: userData.credit + shopCreationQuotaData.value});

    // const transactionCreditToShopData = {
    //   to: shopData.shopkeeperUid,
    //   type: "credit",
    //   reason: "shop-creation",
    //   amount: shopCreationQuotaData.value,
    //   description: "Shop Creation",
    //   userUid: null,
    //   userName: null,
    //   userDisplayPhoto: null,
    //   shopId: shopId,
    //   shopName: shopData.name,
    //   shopkeeperName: userData.firstName + userData.lastName,
    //   shopkeeperDisplayPhoto: userData.displayPhoto,
    //   status: PaymentStatus.COMPLETE,
    //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
    // };

    const transactionCreditToShopkeeperData = {
      to: shopData.shopkeeperUid,
      type: "credit",
      reason: "shop-creation",
      amount: shopCreationQuotaData.value,
      description: "Shop Creation",
      userUid: null,
      userName: null,
      userDisplayPhoto: null,
      shopId: shopId,
      shopName: shopData.name,
      shopDisplayPhoto: shopData.shopDisplayPhoto,
      shopkeeperName: userData.firstName + userData.lastName,
      shopkeeperDisplayPhoto: userData.displayPhoto,
      status: PaymentStatus.COMPLETE,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // console.log(transactionCreditToShopData);
    // const transactionToAddCreditToShopRef = db.collection("transactions").doc();
    // batch.create(transactionToAddCreditToShopRef, transactionCreditToShopData);

    console.log(transactionCreditToShopkeeperData);
    const transactionToAddCreditToShopkeeperRef = db.collection("transactions").doc();
    batch.create(transactionToAddCreditToShopkeeperRef, transactionCreditToShopkeeperData);
  
    if (invitedData.invitedFrom !== null && !privateUserData.creditReceiveFromInvite) {
      privateUserData.creditReceiveFromInvite = true;
      const inviteeUserData = await db
      .collection("users").where('username', '==', invitedData.invitedFrom)
      .get();
      let inviteeData: any;
      inviteeUserData.forEach((doc) => {
        inviteeData = doc.data();
      });
      console.log('invitee user data', inviteeData);
      
      const firstshop = <any>[];
      const firstShopdata = await db
      .collection("shops").where('shopkeeperUid', '==', invitedData.uid)
      .get();
      firstShopdata.forEach((doc) => {
        firstshop.push({ id: doc.id, ...doc.data() });
      }); 
      console.log('testtt' , firstshop);
      console.log('length', firstshop.length);
      const invitedTransferCredits = await db.collection("credit-quotas").doc("shop-invite").get();
      const invitedCredits = invitedTransferCredits.data();
      console.log('invitedCredits', invitedCredits);

      const inviteeTransferCredits = await db.collection("credit-quotas").doc("shop-invite").get();
      const inviteeCredits = inviteeTransferCredits.data();
      console.log('inviteeCredits', inviteeCredits);


      console.log('invited transaction start');
      if(firstshop.length<2){
        if(invitedCredits) {
          const invitedTransactionData = {
          to: invitedData.uid,
          type: "credit",
          reason: "Invited bonus credits",
          amount: invitedCredits.value,
          description: "Invited",
          userUid: invitedData.uid,
          userName: invitedData.firstName + invitedData.lastName,
          userDisplayPhoto: invitedData.displayPhoto,
          shopId: null,
          shopName: null,
          shopkeeperName: null,
          shopkeeperDisplayPhoto: null,
          status: PaymentStatus.COMPLETE,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        
        const invitedTransactionRef = db.collection("transactions").doc();
        batch.create(invitedTransactionRef, invitedTransactionData);
  
        const invitedNewCredits = invitedData.credit + invitedCredits.value;
        console.log('final invitedNewCredits', invitedNewCredits);
        console.log('invitedData.uid', invitedData.uid);
  
        batch.set(shopRef, { credit: shopCreationQuotaData.value + invitedNewCredits }, { merge: true });
  
        const invitedRef = db.collection("users").doc(invitedData.uid);
        batch.set(invitedRef, { credit: invitedNewCredits + shopCreationQuotaData.value }, { merge: true });
        console.log('invitedRef', invitedRef);
    
      }
      console.log('invited transaction end');
      
      console.log('inviteeeee transaction start');
      if (inviteeCredits) {
        const inviteeTransactionData = {
          to: inviteeData.uid,
          type: "credit",
          reason: "Invitee bonus credits",
          amount: inviteeCredits.value,
          description: "Invitee",
          userUid: inviteeData.uid,
          userName: inviteeData.firstName + inviteeData.lastName,
          userDisplayPhoto: inviteeData.displayPhoto,
          shopId: null,
          shopName: null,
          shopkeeperName: null,
          shopkeeperDisplayPhoto: null,
          status: PaymentStatus.COMPLETE,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }
        const inviteeTransactionRef = db.collection("transactions").doc();
        batch.create(inviteeTransactionRef, inviteeTransactionData);
  
        const inviteeNewCredits = inviteeData.credit + inviteeCredits.value;
        console.log('final inviteeNewCredits', inviteeNewCredits);
  
        const inviteeRef = db.collection("users").doc(inviteeData.uid);
        batch.set(inviteeRef, { credit: inviteeNewCredits }, { merge: true });
      }
      }
      else{
        console.log('nooooo bonuuusssss of invite');
      }
    
    console.log('inviteeeee transaction end');

    console.log('ending');

    }











    








    return batch.commit(); 
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
}

export const onCreate = functions.firestore
  .document("/shops/{shopId}")
  .onCreate(
    (
      snapshot: functions.firestore.QueryDocumentSnapshot,
      context: EventContext
    ) => {
      const data = snapshot.data();
      const shopId = context.params.shopId;

      return transferShopCreationCredits(data, shopId);
    }
  );
