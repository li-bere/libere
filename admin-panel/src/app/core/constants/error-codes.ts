export function ErrorMessageGenerator(code) {
  console.log("error code in function", code);

  let errorMessage;
  let arrayOfCodes = [
    {
      code: "auth/user-not-found",
      message:
        "There is no user record corresponding to this identifier." +
        "The user may have been deleted.",
    },
    {
      code: "auth/network-request-failed",
      message:
        "Request Timeout due to network connectivity. Please check your internet connection",
    },
    {
      code: "auth/user-disabled",
      message:
        "You are disabled by administrator " +
        " please contact with administration ",
    },
    {
      code: "auth/invalid-user-token",
      message: "Your credentials are no longer valid. You must sign in again.",
    },
    {
      code: "auth/user-token-expired",
      message: "Your authentication token has been expired. Sign in again",
    },
    {
      code: "auth/argument-error",
      message: "Your credentials are invalid.",
    },
    {
      code: "auth/app-deleted",
      message: "App no more supported ",
    },
    {
      code: "auth/app-not-authorized",
      message:
        "The app identified by the domain where its hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console",
    },
    {
      code: "auth/requires-recent-login",
      message: "Your password was changed recently. You need to re-authenticate your email",
    },
    {
      code: "auth/too-many-requests",
      message: "To many requests. Try again after one minute",
    },
    {
      code: "auth/unauthorized-domain",
      message:
        "You have logged in from an unauthorized area. please contact with app owner for further help",
    },
    {
      code: "auth/web-storage-unsupported",
      message: "Media that you are uploading is not supported format",
    },
    {
      code: "auth/invalid-tenant-id",
      message: "An error occurred. please try again",
    },
    {
      code: "auth/invalid-api-key",
      message: "invalid api key. Please make sure to use valid api key",
    },
    {
      code: "auth/account-exists-with-different-credential",
      message: "user account-exists-with-different-credential",
    },
    {
      code: "auth/credential-already-in-use",
      message: "user acredential-already-in-use",
    },
    {
      code: "auth/operation-not-allowed",
      message: "An error occured .please try again",
    },
    {
      code: "auth/email-already-in-use",
      message: "Email already in use. Provide another valid email account",
    },
    {
      code: "StripeInvalidRequestError",
      message:
        "An Error occurred while creating your Stripe account. Please try again.",
    },
    {
      code: "auth/wrong-password",
      message: "wrong password. please enter correct password",
    },
    {
      code: "imageErrorCode",
      message: "Could not upload your image. Please try again.",
    },
    {
      code: "documentWriteError",
      message: "error occured while saving new details.",
    },
    {
      code: "MessageErrorCode",
      message: "Error While sedning message .please try again",
    },
    {
      code: "documentDeleteError",
      message: "error while deleting. Please try again",
    },
    {
      code: "documentUpdateError",
      message: "Error while updating. please try again",
    },
    {
      code: "cancelled",
      message: "Your Request has been cancelled by server",
    },
    {
      code: "unimplemented",
      message: "Operation is not implemented or not supported",
    },
    {
      code: "deadline-exceeded",
      message: "Request Timeout",
    },
    {
      code: "unknown",
      message: "Unknown error occcured. Please try again",
    },
    {
      code: "invalid-argument",
      message: "Invalid Data " + " Please provide valid details",
    },
    {
      code: "not-found",
      message: "Not Found " + " try again",
    },
    {
      code: "already-exists",
      message: "Already exists. try another",
    },
    {
      code: "permission-denied",
      message: "you not have an enough permission",
    },
    {
      code: "resource-exhausted",
      message: "server not have enough space",
    },
    {
      code: "aborted",
      message: "operation aborted. provide valid data",
    },
    {
      code: "out-of-range",
      message: "To many arguments. provide less arguements",
    },
    {
      code: "internal",
      message: "internal server error occured. try again",
    },
    {
      code: "unavailable",
      message: "service unavailable. please try again",
    },
    {
      code: "data-loss",
      message: "Unrecoverable data loss or corrupted data",
    },
    {
      code: "unauthenticated",
      message:
        "The request does not have valid authentication credentials for the operation",
    },
    {
      code: "failed-precondition",
      message: "Operation rejected due to invalid field",
    },
  ];
  for (let i = 0; i < arrayOfCodes.length; i++) {
    if (arrayOfCodes[i].code == code) {
      errorMessage = arrayOfCodes[i].message;
    }
  }

  return errorMessage;
}
