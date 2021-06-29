import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
const { PushNotifications } = Plugins;
const { LocalNotifications } = Plugins;


@Injectable()
export class FcmService {
  userRole: any;
  notificationData: any;
  constructor(
    private router: Router,
    public afs: AngularFirestore,
    private userService: UserService
  ) {}

    getUserData() {
      this.userService.getUser().subscribe(res => {
        console.log('user data', res);
        this.userRole = res.roles;
      });
    }

  initPush(userId) {
    console.log(userId);
    if (Capacitor.platform !== 'web') {
      this.registerPush(userId);
      this.getUserData();
    }
  }

  async localNotification(data) {
    const randomId = Math.floor(Math.random() * 10000) + 1;
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: data.title,
          body: data.body,
          id: randomId,
          // schedule: { at: new Date(Date.now() + 1000 * 5) }
        }
      ]
    });
    console.log('scheduled notifications', notifs);
  }
 
  private registerPush(userId) {
//     this.fcm.onNotification().subscribe(data => {
//   if(data.wasTapped){
//     console.log("Received in background");
//   } else {
//     console.log("Received in foreground");
//   };
// });

    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });
 
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        console.log(token);
        this.saveTokenToFirestore(userId, token);
      }
    );
 
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });
 
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        this.notificationData = notification;
        this.localNotification(notification);
        console.log('Push received: ' + JSON.stringify(notification));
        console.log('notificationData', this.notificationData);
      }
    );
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        // const data = notification.notification.data;
        // console.log(data);
        // console.log('Action performed: ' + JSON.stringify(notification.notification));
        console.log(this.userRole);
        if (this.userRole.user === true) {
          if (this.notificationData.title === 'Buy Bottle Request') {
            this.router.navigateByUrl(`/user-tabs/transactions`);
          }
          if (this.notificationData.title === 'Low Credits') {
            this.router.navigateByUrl(`/user-tabs/profile`);
          }
        } else {
          if (this.notificationData.title === 'Buy Bottle Request') {
            this.router.navigateByUrl(`/shopkeeper-tabs/transactions`);
          }
          if (this.notificationData.title === 'Low Credits') {
            this.router.navigateByUrl(`/shopkeeper-tabs/profile`);
          }
        }
      }
    );
  //   PushNotifications.addListener('pushNotificationReceived',
  //   (notification: PushNotification) => {
  //     if (this.userRole.user === true) {
  //       if (this.notificationData.title === 'Buy Bottle Request') {
  //         this.router.navigateByUrl(`/user-tabs/transactions`);
  //       }
  //       if (this.notificationData.title === 'Low Credits') {
  //         this.router.navigateByUrl(`/user-tabs/profile`);
  //       }
  //     } else {
  //       if (this.notificationData.title === 'Buy Bottle Request') {
  //         this.router.navigateByUrl(`/shopkeeper-tabs/transactions`);
  //       }
  //       if (this.notificationData.title === 'Low Credits') {
  //         this.router.navigateByUrl(`/shopkeeper-tabs/profile`);
  //       }
  //     }
  //   }
  // );
  }

    // Save the token to firestore
    saveTokenToFirestore(id, token) {
      console.log('save');
      if (!token) { return; }
      const devicesRef = this.afs.collection('devices');
      const docData = {
          token: token.value
      };
      return devicesRef.doc(id).set(docData);
 }

}
