import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { Platform } from '@ionic/angular';
// import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-non-verified',
  templateUrl: './non-verified.page.html',
  styleUrls: ['./non-verified.page.scss'],
})
export class NonVerifiedPage implements OnInit {
  firebaseUser: firebase.User;
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private appLauncher: AppLauncher,
    private router: Router
  ) { 
  }
  

  ngOnInit() {
    console.log("runnnnnnnnnnnn");
    // this.authService.checkupdate();
    // this.authService.currentUserObservable.subscribe((User: firebase.User)=>{
    //   User.reload();
    //   if(User.emailVerified){
    //     this.router.navigateByUrl('user-tabs/home');
    //   }
    //   else{
    //     console.log("verify email first")
    //   }
    // })
  }
  // email(){
  //   this.EmailComposer.open({
  //     app: 'gmail',
  //   })
  // //   let email=""
  // //   this.platform.ready().then(() => {
  // //     open('mailto:'+email);
  // // });
  // // this.email.open({
  // //   app: 'gmail',
  // //   ...
  // // });
  // }

  email() {

  //   let email=""
  //   this.platform.ready().then(() => {
  //     window.open('gmail');
  // });
    const options: AppLauncherOptions = {
      packageName: 'com.google.android.gm'
    }

    // if(this.platform.is('android')) {
    //   options.uri = 'fb://'
    // } else {
    //   options.packageName = 'com.facebook.katana'
    // }

    this.appLauncher.launch(options)
  .then((canLaunch: boolean) =>
                        {console.log('gmail is available');
                        this.router.navigate(['user-tabs/home']);
                        // this.router.navigateByUrl('user-tabs/home');
                                  })
  .catch((error: any) => console.error('gmail is not available'));
  }
  

}
