import { EventContext } from "firebase-functions";

import { functions, admin, db } from "../../main";
import { PaymentStatus } from './../../utils/constants/payment-status';

async function updateBottle(newValue: any, oldValue: any) {
  if (oldValue.assignee === null && newValue.assignee !== null) {
    try {

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
        .doc(newValue.assignee)
        .collection("private")
        .doc("credit-given")
        .get();
      // let privateUserData = privateUserDataRef.data();
      privateUserData = {...privateUserData, ...privateUserDataRef.data()};

      const userSnap = await db
        .collection("users")
        .doc(newValue.assignee)
        .get();
      const user = userSnap.data();

      let credit = 0;
      const dataRef = await db.collection("credit-quotas").doc("bottle-registration").get();
      const creditData = dataRef.data();
      if(creditData && creditData.value && creditData.value > 0) {
        credit = creditData.value;
      } else {
        throw new functions.https.HttpsError(
          "internal",
          "No valid fee set for bottle registeration."
        );
      }

      if (user) {
        if (user.credit) {
          user.credit = user.credit + credit;
        } else {
          user.credit = credit;
        }

        if (user.bottles) {
          user.bottles++;
        } else {
          user.bottles = 1;
        }
        user.updatedAt = admin.firestore.FieldValue.serverTimestamp();
        console.log('user is ', user);
        const batch = db.batch();

       const userRef=  db.collection("users").doc(newValue.assignee);
        //  .set(user, { merge: true });
        batch.set(userRef, user, { merge: true });

        const creditTransactionData = {
          to: user.uid,
          type: "credit",
          reason: "bottle-registration",
          amount: credit,
          description: "Bottle Registeration",
          userUid: user.uid,
          userName: user.firstName + user.lastName,
          userDisplayPhoto: user.displayPhoto,
          shopId: null,
          shopName: null,
          shopkeeperName: null,
          shopkeeperDisplayPhoto: null,
          status: PaymentStatus.COMPLETE,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const creditRef = db.collection("transactions").doc();
        batch.create(creditRef, creditTransactionData);

        const bottle = <any>[];
        const firstBottle = await db
        .collection("bottles").where('assignee', '==', user.uid)
        .get();
        firstBottle.forEach((doc) => {
          bottle.push(doc.data() );
        }); 
        console.log('total bottles are',bottle.length);
      if(bottle.length<2){
        const invitedUserData = await db
        .collection("users").where('uid', '==', newValue.assignee)
        .get();
        let invitedData: any;
        invitedUserData.forEach((doc) => {
          invitedData = doc.data();
        });
        // console.log('invited user data', invitedData);
  
  
  
  
        if(invitedData.invitedFrom !== null && !privateUserData.creditReceiveFromInvite) {
          privateUserData.creditReceiveFromInvite = true;
          const inviteeUserData = await db
          .collection("users").where('username', '==', invitedData.invitedFrom)
          .get();
          let inviteeData: any;
          inviteeUserData.forEach((doc) => {
            inviteeData = doc.data();
          });
          // console.log('invitee user data', inviteeData);
  
          const invitedTransferCredits = await db.collection("credit-quotas").doc("invited-bonus-credits").get();
          const invitedCredits = invitedTransferCredits.data();
          // console.log('invitedCredits', invitedCredits);
  
          const inviteeTransferCredits = await db.collection("credit-quotas").doc("invitee-bonus-credits").get();
          const inviteeCredits = inviteeTransferCredits.data();
          // console.log('inviteeCredits', inviteeCredits);
  
          // console.log('invited transaction start');   
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
    
          // const invitedNewCredits = invitedData.credit + invitedCredits.value;
          // console.log('final invitedNewCredits', invitedNewCredits);
    
          // console.log('invitedData.uid', invitedData.uid);
    
          const invitedRef = await db
          .collection('users')
          .doc(invitedData.uid);
    
          // const invitedRef = db.collection("users").doc(invitedData.uid);
          batch.set(invitedRef, { credit: invitedData.credit + invitedCredits.value+invitedCredits.value }, { merge: true });
          // console.log('invitedRef', invitedRef);
      
        }
        // console.log('invited transaction end');
    
        // console.log('inviteeeee transaction start');
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
          // console.log('final inviteeNewCredits', inviteeNewCredits);
    
          const inviteeRef = db.collection("users").doc(inviteeData.uid);
          batch.set(inviteeRef, { credit: inviteeNewCredits }, { merge: true });
        }
      }
     
    
    console.log('inviteeeee transaction end');

    console.log('ending');

      }


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
      }
      throw new functions.https.HttpsError(
        "invalid-argument",
        "User data not found."
      );
    } catch (error) {
      throw new functions.https.HttpsError("internal", error.message);
    }
  }
}

export const onUpdate = functions.firestore
  .document("/bottles/{bottleId}")
  .onUpdate((change, context: EventContext) => {
    const newValue = change.after.data();
    const oldValue = change.before.data();

    return updateBottle(newValue, oldValue);
  });
