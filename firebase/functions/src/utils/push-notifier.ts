const { admin, db } = require('./../main');
const errorReporter = require('./error-reporter');
import { PushNotificationI } from './models';

const to = require('await-to-js').default;

async function sendPushNotificationToUser(userId: string, notification: PushNotificationI, data={}) {
    console.log('Send notification called');
    const notificationPayload = {
        notification: {
            title: notification.title,
            body: notification.body,
            
        },
        data: {
            
        }
    };
    if(data){
        notificationPayload.data = data;
        
        await db.collection('notifications').doc(userId).collection('notificationspayload').add({createdAt: admin.firestore.FieldValue.serverTimestamp(), ...notificationPayload});
        
    }

    
    let err, deviceSnap;
    [ err, deviceSnap ] = await to(db.collection('devices').doc(userId).get());
    const device = deviceSnap.data();
    console.log(device);
    if (err){
        return errorReporter.reportError('An error occured.', {user: userId});
    }
    if(!device) {
      return errorReporter.reportError('No device token for user.', {user: userId});
    }
      
    return admin.messaging().sendToDevice(device.token, notificationPayload, {priority: 'high'})
}

export{ sendPushNotificationToUser };