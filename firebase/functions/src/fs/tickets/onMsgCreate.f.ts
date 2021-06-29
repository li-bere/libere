import { functions, db } from "../../main";

import { EventContext } from "firebase-functions";

async function updateMsgStatus(data: any, ticketId: string, msgId: string) {
  console.log("ticket create called");
  data.status = "sent";

  return db
    .collection("tickets")
    .doc(ticketId)
    .collection("msgs")
    .doc(msgId)
    .set(data, { merge: true });
}

export const onMsgCreate = functions.firestore
  .document("/tickets/{ticketId}/msgs/{msgId}")
  .onCreate((snap, context: EventContext) => {
    const data = snap.data();
    const ticketId = context.params.ticketId;
    const msgId = context.params.msgId;

    return updateMsgStatus(data, ticketId, msgId);
  });
