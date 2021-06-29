import { functions, admin, db } from "../main";

export const toggleUserBlockStatus = functions.https.onCall(
  async (data, context) => {
    console.log("Toggle user Block called. Block Status:", data.blockStatus);
    console.log(context.auth);

    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Your are not authorized for this operation"
      );
    }

    console.log("User Data", data);

    return new Promise((resolve, reject) => {
      const isDisabled = data.blockStatus
        ? { disabled: true }
        : { disabled: false };

      return admin
        .auth()
        .updateUser(data.userId, isDisabled)
        .then(
          async (userRecord) => {
            await db
              .collection("users")
              .doc(data.userId)
              .set({ isBlocked: data.blockStatus }, { merge: true })
              .then(() => {
                const blockStatusConsoleMsg = data.blockStatus
                  ? "User Blocked"
                  : "User Unblocked";
                console.log(blockStatusConsoleMsg, userRecord.toJSON());
                resolve();
              });
          },
          (error) => {
            console.log(error);
            reject();
          }
        )
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  }
);
