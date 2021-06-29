const { functions, db } = require('./../main');
const errorReporter = require('./error-reporter');
const nodemailer = require('nodemailer');

const to = require('await-to-js').default;

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

async function sendEmailNotificationToUser(userId: string, subject: string, html: string) {
    console.log('Send email called');
    console.log(mailTransport);
    let err, userSnap;
    [ err, userSnap ] = await to(db.collection('users').doc(userId).get());
    const user = userSnap.data();
    console.log(user);
    if (err){
      return errorReporter.reportError('An error occured.', {user: userId});
    }
    if(!user) 
      return errorReporter.reportError('No user found for email notification.', {user: userId});

    const mailOptions = {
        from: functions.config().gmail.email,
        to: user.email,
        subject: subject,
        html: html
    }
      
    return mailTransport.sendMail(mailOptions);
}

export{ sendEmailNotificationToUser };