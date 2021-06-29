import { functions } from "../main";
const errorReporter = require("./../utils/error-reporter");

import {
  Client,
  DistanceMatrixRequest,
  TravelMode,
  DistanceMatrixResponse,
} from "@googlemaps/google-maps-services-js";

export const getDistance = functions.https.onCall((data, context) => {
  console.log("Get Directions called");
  if (!context.auth) {
    return errorReporter.reportError("User is not authenticated.");
  }
  if (
    typeof data.origin.lat !== "number" ||
    typeof data.origin.lng !== "number" ||
    typeof data.destination.lat !== "number" ||
    typeof data.destination.lng !== "number"
  ) {
    return errorReporter.reportError("Bad Data.");
  }
  const client = new Client({});
  const distanceMatrixRequest: DistanceMatrixRequest = {
    params: {
      origins: [{ lat: data.origin.lat, lng: data.origin.lng }],
      destinations: [{ lat: data.destination.lat, lng: data.destination.lng }],
      mode: TravelMode.driving,
      key: functions.config().googlemaps.key,
    },
  };
  return client.distancematrix(distanceMatrixRequest).then(
    (res: DistanceMatrixResponse) => {
      return res.data;
    },
    (error) => {
      console.log(error);
      return errorReporter.reportError(error.message);
    }
  );
});
