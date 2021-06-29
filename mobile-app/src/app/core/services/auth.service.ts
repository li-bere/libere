import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { AlertService } from '@app/core/services/alert.service';
import { LoadingService } from '@app/core/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseUser: firebase.User;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private facebook: Facebook,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private translate: TranslateService,
   
  ) {
    this.afAuth.authState.subscribe((firebaseUser: firebase.User) => {
      console.log('User Change', firebaseUser);
      this.firebaseUser = firebaseUser;
    });
  }

  checkupdate(){
     this.afAuth.authState.subscribe(user=>{
      console.log(user);
      return user;
    })
  }
  get authenticated(): boolean {
    return this.firebaseUser !== null && this.firebaseUser !== undefined;
  }

  get currentUser(): firebase.User | null {
    return this.authenticated ? this.firebaseUser : null;
  }

  get currentUserObservable(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  get currentUserId(): string {
    return this.authenticated ? this.firebaseUser.uid : null;
  }

  get currentUserEmail(): string {
    return this.authenticated ? this.firebaseUser.email : null;
  }

  async register(userData): Promise<void> {
    this.translate.get('ALERT_REGISTER_SUCCESS').subscribe(async res => {
      await this.loadingService.presentLoading(res);
    });
    
    try {
      await this.afAuth.createUserWithEmailAndPassword(
        userData.email,
        userData.password
      );
       let alertReg : string;
       alertReg = ""; 
      await this.currentUserObservable.pipe(take(1)).toPromise();
      await this.sendVerificationEmail();
      
      this.translate.get('ALERT_REGISTER_SUCCESS').subscribe(res => {
        // this.alertService.success(res);
        alertReg +=res; 
      });
      alertReg += userData.email;
      this.translate.get('ALERT_REGISTER_SUCCESS1').subscribe(res => {
        // this.alertService.success(res);
        alertReg +=res; 
        this.alertService.mailAlert(alertReg);
      });
      this.router.navigate(['user']);
      await this.loadingService.dismissLoader();
      // this.alertService.success('ALERT_REGISTER_SUCCESS');
      // this.afAuth.signOut();
      
      
    } catch (error) {
      await this.loadingService.dismissLoader();
      console.error(error);
      this.alertService.errorAlert(error.message);
    }
  }

  async sendVerificationEmail(showLoader = false): Promise<void> {
    let actionCodeSettings = {
      url: 'https://li-bere.it/email'
       + firebase.auth().currentUser.email,
     
      android: {
        packageName: 'com.libere.libere',
        installApp: true,
        minimumVersion: '1'
      },
      handleCodeInApp: false,
      // When multiple custom dynamic link domains are defined, specify which
      // one to use.
      dynamicLinkDomain: "libere.page.link"
    };
    if (showLoader) {
      const loadingText = await this.translate.get('SENDING').pipe(take(1)).toPromise();
      await this.loadingService.presentLoading(loadingText);
      // this.translate.get('SENDING').subscribe(async res => {
      //   await this.loadingService.presentLoading(res);
      // });
      // await this.loadingService.presentLoading('Sending...');
    }
    if (!this.authenticated) {
      if (showLoader) {
        await this.loadingService.dismissLoader();
      }
      return Promise.reject({ message: 'Not logged in' });
    }
    if (this.firebaseUser.emailVerified) {
      if (showLoader) {
        await this.loadingService.dismissLoader();
      }
      return Promise.reject({ message: 'Verified already' });
    }
    return this.firebaseUser
      .sendEmailVerification(actionCodeSettings)
      .then(async () => {
        if (showLoader) {
          await this.loadingService.dismissLoader();
        }
      })
      .catch(async (error) => {
        if (showLoader) {
         await this.loadingService.dismissLoader();
        }
        console.error(error);
        this.alertService.errorAlert(error.message);
      });
  }

  async emailLogin(email: string, password: string): Promise<void> {
    const loadingText = await this.translate.get('PAGE_CONTACT_US_LOADING').pipe(take(1)).toPromise();
    await this.loadingService.presentLoading(loadingText);
    // this.translate.get('PAGE_CONTACT_US_LOADING').subscribe(async loading => {
    //   await this.loadingService.presentLoading(loading);
    //       });
   
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        console.log('dismiss loading');
        await this.loadingService.dismissLoader();
      })
      .catch(async (error) => {
        console.error(error);
        await this.loadingService.dismissLoader();
        this.alertService.errorAlert(error.message);
      });
  }

  async facebookLogin() {
    this.facebook
      .login(['public_profile','user_friends','email'])
      .then((response: FacebookLoginResponse) => {
        console.log('access token', response.authResponse.accessToken);
        this.translate.get('SIGNIN').subscribe(async res => {
      await this.loadingService.presentLoading(res);
    });
        // this.loadingService.presentLoading('Signing In...');
        const credential = firebase.auth.FacebookAuthProvider.credential(
          response.authResponse.accessToken
        );
        console.log(JSON.stringify(credential));
        this.afAuth.signInWithCredential(credential).then(
          async (loginResponse) => {
            console.log('Response: ', loginResponse);
            try {
              await this.currentUserObservable.pipe(take(1)).toPromise();
              await this.sendVerificationEmail();
            } catch (error) {
              await this.loadingService.dismissLoader();
            }
            await this.loadingService.dismissLoader();
          },
          async (error) => {
            console.log(JSON.stringify(error));
            this.alertService.errorAlert(error.message);
            this.facebook.logout();
            await this.loadingService.dismissLoader();
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private async reAuthenticateUser(
    credential: firebase.auth.AuthCredential
  ): Promise<void> {
    try {
      await this.firebaseUser.reauthenticateWithCredential(credential);
      return;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateEmail(email: string, password: string): Promise<void> {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.currentUser.email,
        password
      );
      await this.reAuthenticateUser(credential);
      await this.firebaseUser.updateEmail(email);
      return this.sendVerificationEmail();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updatePassword(
    oldPassword: string,
    newpassword: string
  ): Promise<void> {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.firebaseUser.email,
        oldPassword
      );
      await this.reAuthenticateUser(credential);
      return this.firebaseUser.updatePassword(newpassword);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async resetPassword(email: string, showLoader = true): Promise<void> {
    let actionCodeSettings = {
      url: 'https://li-bere.it/email'
       +email,
     
      android: {
        packageName: 'com.libere.libere',
        installApp: true,
        minimumVersion: '1'
      },
      handleCodeInApp: false,
      // When multiple custom dynamic link domains are defined, specify which
      // one to use.
      dynamicLinkDomain: "libere.page.link"
    };
    if (showLoader) {
      this.translate.get('SENDING').subscribe(async res => {
        await this.loadingService.presentLoading(res);
      });
      // await this.loadingService.presentLoading('Sending...');
    }
    return this.afAuth
      .sendPasswordResetEmail(email,actionCodeSettings)
      .then(async () => {
        if (showLoader) {
          await this.loadingService.dismissLoader();
        }
        this.translate.get('ALERT_EMAIL_VERIFY').subscribe(res => {
          this.alertService.mailAlert(res);
        });
        // this.alertService.success(`An email has been sent to ${email} with instructions to reset the password`);
        // this.router.navigate(['login']);
      })
      .catch(async (error) => {
        console.error(error);
        if (showLoader) {
         await this.loadingService.dismissLoader();
        }
        this.alertService.errorAlert(error.message);
      });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut()
    .catch((error) => {
      console.error(error);
      this.alertService.errorAlert(error.message);
    });
  }
}
