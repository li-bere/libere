import { EventContext } from "firebase-functions";
import { functions } from "../../main";
import * as sgMail from '@sendgrid/mail';
// const nodemailer = require("nodemailer");
// const smtpTransport = require("nodemailer-smtp-transport");

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

// async function sendInviteEmail(data: any) {
//   console.log(functions.config().gmail.email);
//   console.log(functions.config().gmail.password);
  /* const gmailEmail = encodeURIComponent(functions.config().gmail.email);
  const gmailPassword = encodeURIComponent(functions.config().gmail.password);
  const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`
  ); */

  // const mailTransport = nodemailer.createTransport(
  //   smtpTransport({
  //     service: "gmail",
  //     host: "smtp.gmail.com",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: functions.config().gmail.email,
  //       pass: functions.config().gmail.password,
  //     },
  //   })
  // );

  // console.log("mail transport");

  // return mailTransport
  //   .sendMail({
  //     from: functions.config().gmail.email,
  //     to: data.invitee,
  //     subject: "Invitation",
  //     html:
  //       "<p>You have been invited to Libere. Try our platform <a href='li-bere.it'>here.</a></p>",
  //   })
  //   .then(() => console.log("mail sent"))
  //   .catch((error: any) => console.log(error));
// }

export const onCreate = functions.firestore
  .document("/invited-users/{inviteId}")
  .onCreate(
    async (
      snapshot: functions.firestore.QueryDocumentSnapshot,
      context: EventContext
    ) => {
      const data = snapshot.data();

      const msg = {
        to: data.invitee,
        from: 'noreply@li-bere.it',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
          subject: 'Invitation to Libere',
          name: data.inviterId,
          context: 'text iss thiiss',
           mail: '<p>You have been invited to Libere. Try our platform here</p>'
          //
        },
        hideWarnings: true
      };
      console.log(msg);
      await sgMail.send(msg)
  .then(() => {
    //Celebrate
    console.log('Email Sent!');
  })
  .catch(error => {

    //Log friendly error
    console.error(error.toString());

    //Extract error msg

    //Extract response msg
  });

      // return sendInviteEmail(data);
    }
  );
