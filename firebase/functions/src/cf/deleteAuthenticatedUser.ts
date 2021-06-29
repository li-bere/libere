import { functions, admin } from "../main";

export const deleteAuthenticatedUser = functions.https.onCall(
  async (data, context) => {
    console.log("Delete Auth User called");
    console.log(context.auth);

    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Your are not authorized for this operation"
      );
    }
    console.log("User Data", data);

    return admin
      .auth()
      .deleteUser(data.id)
      .then(() => {
        console.log("Authenticated User Deleted");
      })
      .catch((error) => {
        console.log("An error occurred while deleting Authenticated user", error);
      });
  }
);
