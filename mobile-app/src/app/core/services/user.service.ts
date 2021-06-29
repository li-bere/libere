import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { UserI } from './../models/user';
import { CurrentTimeService } from '@app/core/services/current-time.service';
import { DeviceIdService } from '@app/core/services/device-id.service';
import { StorageService } from '@app/core/services/storage.service';
import { LoadingService } from '@app/core/services/loading.service';
import { ToastService } from '@app/core/services/toast.service';
import { AuthService } from '@app/core/services/auth.service';
import { QuotaI } from '../models/quota';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import introJs from '../../../../node_modules/intro.js';
import { rankingI } from '../models/user-ranking';
import { JoyrideService } from 'ngx-joyride';
import { JoyrideOptions } from 'ngx-joyride/lib/models/joyride-options.class';
// import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: Observable<UserI>;
  uid: any;

  constructor(
    private afStore: AngularFirestore,
    private currentTimeService: CurrentTimeService,
    private deviceIdService: DeviceIdService,
    private storageService: StorageService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private authService: AuthService,
    private translate: TranslateService,
    private platform: Platform,
    private storage: Storage,
    private joyrideService: JoyrideService
  ) {
    this.authService.currentUserObservable.subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.uid=firebaseUser.uid;
        this.user = this.afStore
        .collection('users')
        .doc<UserI>(firebaseUser.uid)
        .valueChanges();
        /* .subscribe((user: UserI) => {
          this.user = user;
        }); */
      }
    });
  }

  getUser(): Observable<UserI> {
    return this.user;
    /* this.authService.currentUserObservable.subscribe(user => {
      return this.afStore
      .collection('users')
      .doc<UserI>(this.user.uid)
      .valueChanges();
    }); */
    /* return this.afStore
      .collection('users')
      .doc<UserI>(this.user.uid)
      .valueChanges(); */
  }

  async addUser(userData) {
    let ranking: rankingI={
    uid: this.authService.currentUserId,
    username: userData.username,
    profilePic:null,
    firstName:null,
    lastName:null,
    dailyco2: 0,
    dailypla2:0,
    weeklyco2:0,
    weeklypla2:0,
    monthlypla2:0,
    monthlyco2:0,
    }
    
    this.afStore.collection('rankings').doc(this.uid).set(ranking);
    console.log(userData);
    const deviceId = await this.deviceIdService.getDeviceid();
    const currentTime = this.currentTimeService.getCurrentTime();

    const firstName = this.authService.currentUser.displayName
      ? this.authService.currentUser.displayName.split(' ')[0]
      : '';
    const lastName = this.authService.currentUser.displayName
      ? this.authService.currentUser.displayName.split(' ')[1]
      : '';
    const displayPhoto = this.authService.currentUser.photoURL
      ? this.authService.currentUser.photoURL
      : null;
    const user: UserI = {
      uid: this.authService.currentUserId,
      email: this.authService.currentUserEmail,
      username: userData.username,
      firstName,
      lastName,
      dob: '',
      address: '',
      phone: null,
      displayPhoto,
      createdAt: currentTime,
      updatedAt: currentTime,
      deviceId,
      credit: null,
      roles: {},
      invitedFrom: userData.refferal ? userData.refferal : null
    };
    console.log(user);
    userData.isShopKeeper
      ? (user.roles.shopkeeper = true)
      : (user.roles.user = true);
    if (userData.refferal && userData.refferal !== '') {
      // user.referredBy = userData.referral.toLowerCase();
      return this.checkReferredUser(user);
    }
    else {
      return this.updateUser(user, true, true);
    }
  }
  async shopKeeperRequest(){
    console.log('req called');
    let userName: any;
    this.user.subscribe((res:UserI)=>{
      userName=res.username;
    })

    await this.afStore.collection('Requests').add({id:this.uid});
    this.toastService.presentToast('Request sent wait for approval');
  }

  async checkReferredUser(newUser: UserI) {
    console.log(newUser);
    const users = await this.afStore
      .collection<UserI>('users', (ref) =>
        ref.where('username', '==', newUser.invitedFrom)
      )
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    if (
      users &&
      users.length > 0 &&
      users[0].uid !== this.authService.currentUserId
    ) {
      return this.updateUser(newUser, true, true);
    } else {
      let msg;
      this.translate.get('INVALID_REFERAL').subscribe(res => {
        console.log(res);
        msg= res;
      });
      return Promise.reject({
        message: msg,
      });
    }
  }

  async updateUser(
    user: UserI,
    verifyUsername = false,
    showLoader = false
  ): Promise<void> {
    if (showLoader) {
      const loadingText = await this.translate.get('UPDATING').pipe(take(1)).toPromise();
      await this.loadingService.presentLoading(loadingText);
      // await this.loadingService.presentLoading('Updating...');
    }
    if (!this.authService.authenticated) {
      return Promise.reject({ message: 'Not logged in.' });
    }
    if (verifyUsername) {
      const users = await this.afStore
        .collection<UserI>('users', (ref) =>
          ref.where('username', '==', user.username)
        )
        .valueChanges()
        .pipe(take(1))
        .toPromise();
      if (
        users &&
        users.length > 0 &&
        users[0].uid !== this.authService.currentUserId
      ) {
        if (showLoader) {
          await this.loadingService.dismissLoader();
        }
        return Promise.reject({
          message: 'This username is not available, Kindly try another.',
        });
      }
    }

    const userDocumentRef = this.afStore
      .collection('users')
      .doc(this.authService.currentUserId);
    user.updatedAt = this.currentTimeService.getCurrentTime();
    return userDocumentRef
      .set(user, { merge: true })
      .then(async () => {
        let query=this.afStore.collection('rankings').doc(this.uid);
        query.update({
          
          firstName: user.firstName,
          lastName: user.lastName
        })
        if (showLoader) {
         await this.loadingService.dismissLoader();
        }
      })
      .catch(async (error) => {
        if (showLoader) {
         await this.loadingService.dismissLoader();
        }
        console.error(error);
        this.toastService.presentToast(error.message);
      });
      
  }

  async saveUserDisplayPhoto(photo: string) {
    try {
      const photPath = `profile/${this.authService.currentUserId}.jpeg`;
      const ref = await this.storageService.saveFile(photPath, photo, {
        contentType: 'image/jpeg',
      });
      const downloadUrl = await ref.getDownloadURL().pipe(take(1)).toPromise();
      const userData = await this.getUser().pipe(take(1)).toPromise();
      userData.displayPhoto = downloadUrl;
      let query=this.afStore.collection('rankings').doc(this.uid);
      query.update({
        profilePic: downloadUrl,
      })
      await this.updateUser(userData);
      return;
    } catch (error) {
      throw error;
    }
  }

  inviteUser(data) {
    const invitedUserRef = this.afStore.collection('invited-users');
     console.log(data);
  //   let body="body:you are invited to libere";
  //   let emaillink="mailto:"+data.invitee+"?subject=:you are invited to libere by :" + data.inviterUserName;
  //   console.log(emaillink);
  //   // let emaillink="mailto:+",data,+"?subject=Hello%20again?body:you are invited to libere";
  //   this.platform.ready().then(() => {
  //     open(emaillink,"_system");
  // })
    return invitedUserRef.add(data);
  }
  email(){
    
  }
  

  getAllInvitesOfCurrentUser() {
    const invitationEmails = this.afStore.collection(`invited-users`, ref =>
    ref.where('invitee', '==', this.authService.currentUserEmail)).valueChanges();
    return invitationEmails;
  }

  getProfile(profileId) {
    return this.afStore
    .collection('users')
    .doc<UserI>(profileId)
    .valueChanges();
  }
  getranking(){
    let ranking= this.afStore.collection('rankings').doc(this.uid).valueChanges();
    return ranking;
  }

  userSideIntro() {
    const options: JoyrideOptions = {
      steps: 
      [ 
        'firstStep',
        'secondStep',
        'thirdStep',
        'fourthStep',
        'fifthStep',
        'sixthStep',
        'seventhStep',
        'eighthStep'
      ],
      themeColor: '#00495e',
      showCounter: true
    };
    this.joyrideService.startTour(options);
    this.storage.set('introShown', true);
  }

  shopSideIntro() {
    const options: JoyrideOptions = {
      steps: 
      [ 
        'firstStep',
        'secondStep',
        'thirdStep',
        'fourthStep',
        'fifthStep',
        'sixthStep',
        'seventhStep',
        'eighthStep'
      ],
      themeColor: '#00495e',
      showCounter: true
    };
    this.joyrideService.startTour(options);
    this.storage.set('introShown', true);
  }

  intro() {
    let next, skip, previous, done;
    let introduction: any;
    let introduction1: any;
    let introduction2: any;
    let introduction3: any;
    let introduction4: any;
    this.translate.get('TUTORIAL_INTRO').subscribe(res => {
      console.log(res);
      introduction = res;

    });
    this.translate.get('TUTORIAL_INTRO1').subscribe(res => {
      console.log(res);
      introduction1 = res;

    });
    this.translate.get('TUTORIAL_INTRO2').subscribe(res => {
      console.log(res);
      introduction2 = res;

    });
    this.translate.get('TUTORIAL_INTRO3').subscribe(res => {
      console.log(res);
      introduction3 = res;

    });
    this.translate.get('TUTORIAL_INTRO4').subscribe(res => {
      console.log(res);
      introduction4 = res;

    });
    this.translate.get('NEXT').subscribe(res => {
      console.log(res);
      next = res;

    });
    this.translate.get('SKIP').subscribe(res => {
      console.log(res);
      skip = res;

    });
    this.translate.get('PREVIOUS').subscribe(res => {
      console.log(res);
      previous = res;

    });
    this.translate.get('DONE').subscribe(res => {
      console.log(res);
      done = res;

    });

    const intro = introJs.introJs();
    this.storage.set('introShown', true);
    // Initialize steps
    intro.setOptions({

      steps: [
        {
          intro: introduction,

        },
        {
          element: document.querySelector('.transactions'),
          intro: introduction1,
          position: 'bottom',
        },
        {
          element: document.querySelector('#maps-page'),
          intro: introduction2,
          position: 'bottom',
        },
        {
          element: document.querySelector('.gotoScan'),
          intro:
          introduction3,
          position: 'bottom',
        },
        {
          element: document.querySelector('.profile'),
          intro: introduction4,
          position: 'bottom',
        },
      ],
      showProgress: true,
      overlayOpacity: '0.8',
      exitOnOverlayClick: false,
      nextLabel: next,
      skipLabel: skip,
      prevLabel: previous,
      doneLabel: done
    });

    intro.start();

  }
}
