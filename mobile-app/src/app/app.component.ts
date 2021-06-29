import { filter, take } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Platform, AlertController, MenuController, IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;

import { ToastService } from '@app/core/services/toast.service';
import { AlertService } from '@app/core/services/alert.service';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';

import { UserI } from '@app/core/models/user';
import { User } from 'firebase';
import { FcmService } from './core/services/fcm.service';
import { LanguageService } from './core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { TransactionService } from './core/services/transaction.service';
import { TransactionI } from './core/models/transaction';
import { TransactionStatus } from './core/constants/transaction-status';
import { TransactionDetailsPage } from './shared/pages/transaction-details/transaction-details.page';
import { Storage } from '@ionic/storage';
import { ThemeService } from './core/services/theme.service';
import {  NgZone } from '@angular/core';
import { SplashComponent } from './shared/components/splash/splash.component';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  languages = [];
  selected = '';
  titleHome: any;
  @ViewChild(IonRouterOutlet, { static : true }) IonRouterOutlet: IonRouterOutlet;
  public selectedIndex = 0;
  public nvuserAppPages = [
    {
      title: 'Home',
      url: '/user-tabs/home',
      icon: 'home',
    },
    {
      title: 'Transactions',
      url: '/non-verified',
      icon: 'cash',
    },
    {
      title: 'Scan',
      url: '/user-tabs/scan',
      icon: 'qr-code',
    },
   
    {
      title: 'Map',
      url: '/non-verified',
      icon: 'earth',
    },
    {
      title: 'Profile',
      url: '/user-tabs/profile',
      icon: 'person',
    },
    {
      title: 'Register Bottle',
      url: 'user-tabs/bottles/add',
      icon: 'wine-outline',
    },
    {
      title: 'Suggest Fountains',
      url: 'user-tabs/request-fountain-registry',
      icon: 'water-outline',
    },
  ];
  public userAppPages = [
    {
      title: 'Home',
      url: '/user-tabs/home',
      icon: 'home',
    },
    {
      title: 'Transactions',
      url: '/user-tabs/transactions',
      icon: 'cash',
    },
    {
      title: 'Scan',
      url: '/user-tabs/scan',
      icon: 'qr-code',
    },
   
    {
      title: 'Map',
      url: '/user-tabs-map',
      icon: 'earth',
    },
    {
      title: 'Profile',
      url: '/user-tabs/profile',
      icon: 'person',
    },
    {
      title: 'Register Bottle',
      url: 'user-tabs/bottles/add',
      icon: 'wine-outline',
    },
    {
      title: 'Suggest Fountains',
      url: 'user-tabs/request-fountain-registry',
      icon: 'water-outline',
    },
  ];

  public shopkeeperAppPages = [
    {
      title: 'Home',
      url: '/shopkeeper-tabs/home',
      icon: 'home',
    },
    {
      title: 'Transactions',
      url: '/shopkeeper-tabs/transactions',
      icon: 'cash',
    },
    {
      title: 'Scan',
      url: '/shopkeeper-tabs/scan',
      icon: 'qr-code',
    },
    {
      title: 'Shops',
      url: '/shopkeeper-tabs/shops',
      icon: 'pricetags',
    },
    
    {
      title: 'Profile',
      url: '/shopkeeper-tabs/profile',
      icon: 'person',
    },
    {
      title: 'Add Shops',
      url: '/shopkeeper-tabs/shops/add',
      icon: 'add-circle-outline',
    },
  ];
  public nvshopkeeperAppPages = [
    {
      title: 'Home',
      url: '/shopkeeper-tabs/home',
      icon: 'home',
    },
    {
      title: 'Transactions',
      url: '/shopkeeper-tabs/transactions',
      icon: 'cash',
    },
    {
      title: 'Scan',
      url: '/shopkeeper-tabs/scan',
      icon: 'qr-code',
    },
    {
      title: 'Shops',
      url: '/shopkeeper-tabs/shops',
      icon: 'pricetags',
    },
    
    {
      title: 'Profile',
      url: '/shopkeeper-tabs/profile',
      icon: 'person',
    },
    {
      title: 'Add Shops',
      url: '/non-verified',
      icon: 'add-circle-outline',
    },
  ];  

  appPages = [];

  firebaseUser: User;
  user: UserI;
  backButtonPressedAt = Date.now();
  userId: any;
  transactions: Array<TransactionI>;
  transactionStatus = TransactionStatus;
  loading = false;
  userData: any;
  isShopkeeper: Boolean;
  darkValue: any;
  constructor(
    public router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuController: MenuController,
    private alertController: AlertController,
    private toastService: ToastService,
    private alertService: AlertService,
    private authService: AuthService,
    private userService: UserService,
    private fcmService: FcmService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private transactionService: TransactionService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private storage: Storage,
    private themeService: ThemeService,
    private zone: NgZone

  ) {
    this.initializeApp();

  }



  initializeApp() {
    App.addListener('appUrlOpen',  (data: any) => {
      console.log('data before zone is', data);
      // url: 'https://li-bere.it/email'
      this.zone.run(() => {
        console.log('received');
        console.log('data after zone is ',data);
          // const slug = data.url.split(".app").pop();
        
      });
  });
    this.platform.ready().then(() => {
      this.menuController.swipeGesture(false);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.presentModal();
      this.languageService.setInitialAppLanguage();
      this.storage.get('selected-app-theme').then((res) => {
        this.themeService.setAppTheme(res);
      });
      // this.initializeSideMenu();
      
    });


  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SplashComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }


  initializeSideMenu(){
    this.translate.get('MODEL_USER_SIDEBAR_HOME_LABEL').subscribe(res => {
      console.log(res);

      this.userAppPages[0].title = res;
      this.nvuserAppPages[0].title = res;
    });
    this.translate.get('MODEL_USER_SIDEBAR_TRANSACTIONS_LABEL').subscribe(res => {
      console.log(res);

      this.userAppPages[1].title = res;
      this.nvuserAppPages[1].title = res;
      
    });
    this.translate.get('MODEL_USER_SIDEBAR_SCAN_LABEL').subscribe(res => {
      console.log(res);

      this.userAppPages[2].title = res;
      this.nvuserAppPages[2].title = res;
    });
    this.translate.get('MODEL_USER_SIDEBAR_MAP_LABEL').subscribe(res => {
      console.log(res);

      this.userAppPages[3].title = res;
      this.nvuserAppPages[3].title = res;
    });
    this.translate.get('MODEL_USER_SIDEBAR_PROFILE_LABEL').subscribe(res => {
      console.log(res);

      this.userAppPages[4].title = res;
      this.nvuserAppPages[4].title = res;
    });
    this.translate.get('PAGE_USER_HOME_REGISTER_BOTTLE_BUTTON').subscribe(res => {
      console.log(res);

      this.userAppPages[5].title = res;
      this.nvuserAppPages[5].title = res;
    });
    this.translate.get('PAGE_USER_HOME_SUGGEST_FOUNTAINS_BUTTON').subscribe(res => {
      console.log(res);

      this.userAppPages[6].title = res;
      this.nvuserAppPages[6].title = res;
    });





    this.translate.get('MODEL_SHOPKEEPER_SIDEBAR_HOME_LABEL').subscribe(res => {
      console.log(res);
      
      this.shopkeeperAppPages[0].title = res;
      this.nvshopkeeperAppPages[0].title = res;
    });
    this.translate.get('MODEL_SHOPKEEPER_SIDEBAR_TRANSACTIONS_LABEL').subscribe(res => {
      console.log(res);

      this.shopkeeperAppPages[1].title = res;
      this.nvshopkeeperAppPages[1].title = res;
    });
    this.translate.get('MODEL_SHOPKEEPER_SIDEBAR_SCAN_LABEL').subscribe(res => {
      console.log(res);

      this.shopkeeperAppPages[2].title = res;
      this.nvshopkeeperAppPages[2].title = res;
    });
    this.translate.get('PAGE_SHOPKEEPER_HOME_VIEW_SHOPS_LABEL').subscribe(res => {
      console.log(res);

      this.shopkeeperAppPages[3].title = res;
      this.nvshopkeeperAppPages[3].title = res;
    });
    this.translate.get('MODEL_SHOPKEEPER_SIDEBAR_PROFILE_LABEL').subscribe(res => {
      console.log(res);

      this.shopkeeperAppPages[4].title = res;
      this.nvshopkeeperAppPages[4].title = res;
    });
    this.translate.get('PAGE_SHOPKEEPER_HOME_ADD_SHOPS_LABEL').subscribe(res => {
      console.log(res);

      this.shopkeeperAppPages[5].title = res;
      this.nvshopkeeperAppPages[5].title = res;
    });

  }

  ngOnInit() {
   
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (this.authService.authenticated) {
          this.loading = true;
          this.userService.getUser().subscribe((user) => {
            this.userData = user;
            if(user.roles.shopkeeper){
              this.isShopkeeper=true;
              console.log("user is" ,this.isShopkeeper);
            }
           
           
           
            this.loading = false;
           
            if (user) {
              const urlFragment = user.roles.shopkeeper
                ? 'shopkeeper-tabs/'
                : 'user-tabs/';
              const path = event.url.split(urlFragment)[1];
              if (path !== undefined) {
                this.selectedIndex = this.appPages.findIndex(
                  (page) => page.title.toLowerCase() === path.toLowerCase()
                );
              }
            }
          });
        }
      });
     
    
    this.initializeBackButton();
    this.initializeAlerts();
    this.initialRouting();
    
    this.languages = this.languageService.getLanguages();
    this.selected = this.languageService.selected;
    // this.initializeNotification(this.authService.currentUserId);
  }



  initializeBackButton() {
    let backButtonTapped = 0;

    this.platform.backButton.subscribeWithPriority(-1, async () => {
      console.log('dismisseed');
      this.toastService.dismissAllToast();
      if (!this.IonRouterOutlet.canGoBack()) {
        console.log(this.router.url);
        if (this.router.url === '/user-tabs/home' || this.router.url === '/shopkeeper-tabs/home') {
          backButtonTapped++;
          if (backButtonTapped === 2) {
            App.exitApp();
          }
          else {
            console.log('back button clicked');
            this.translate.get('COMPONENT_APP_MSG').subscribe(res => {
              this.toastService.presentToast(res);
            });
            // this.toastService.presentToast('{{"COMPONENT_APP_MSG" | translate }}');
          }
        }
        else {
          backButtonTapped = 0;
          this.router.url.includes('/user-tabs/') ?
          this.router.navigate(['/user-tabs/home']) :
          this.router.navigate(['/shopkeeper-tabs/home']);
        }
      }
    });
  }

  tutorialShow() {
    if(this.user.roles.user) {
      console.log('user');
      this.router.navigate(['/user-tabs/home']).then(() => {
        this.userService.shopSideIntro();
      });
    }
    if(this.user.roles.shopkeeper) {
      console.log('shopkeeper');
      this.router.navigate(['/shopkeeper-tabs/home']).then(() => {
        this.userService.shopSideIntro();
      });
    }
  }

  tutorial(){
    console.log("clicked");
    this.userService.intro();
  }
  
  initializeAlerts() {
    this.alertService.getMessage().subscribe(async (message) => {
      if (message) {
        if (message.type === 'error') {
          const alert = await this.alertController.create({
            header: 'Error',
            message: message.text,
            buttons: ['Dismiss'],
          });
          this.translate.get('PAGE_LOGIN_ALERT_TITLE').subscribe(res => {
            // console.log(res);
            alert.header = res;
            // this.userAppPages[0].title = res;
          });
          this.translate.get('PAGE_LOGIN_ALERT_BUTTON').subscribe(res => {
            console.log(res);
            alert.buttons = [res];
            // this.userAppPages[0].title = res;
          });
          this.translate.get('PAGE_LOGIN_ALERT_MESSAGE').subscribe(res => {
            console.log(res);
            alert.message = res;
            // this.userAppPages[0].title = res;
          });
          await alert.present();
        } else if (message.type === 'success') {
          const alert = await this.alertController.create({
            header: 'Success',
            message: message.text,
            buttons: ['OK'],
          });
          this.translate.get('PAGE_LOGIN_SUCCESS_TITLE').subscribe(res => {
            // console.log(res);
            alert.header = res;
            // this.userAppPages[0].title = res;
          });
          this.translate.get('PAGE_LOGIN_SUCCESS_BUTTON').subscribe(res => {
            console.log(res);
            alert.buttons = res;
            // this.userAppPages[0].title = res;
          });
          await alert.present();
        }
      }
    });
  }

  initialRouting() {
    this.authService.currentUserObservable.subscribe((firebaseUser) => {

      // console.log(this.userId);
      // firebaseUser.reload();
      if (firebaseUser) {
        this.firebaseUser = firebaseUser;
        // if (firebaseUser.emailVerified) {
         
          this.userService.getUser().pipe(take(1)).subscribe((user) => {
            this.user = user;
            console.log(this.user);
            if (user && user.username && user.username !== '') {
              this.initializeSideMenu();
             
              if (user && user.roles.shopkeeper  && firebaseUser.emailVerified) {
                this.appPages = this.shopkeeperAppPages;
                this.initializeshop();
                this.router.navigate(['shopkeeper-tabs']);
              } 
              if (user && user.roles.shopkeeper  && !firebaseUser.emailVerified) {
                this.appPages = this.nvshopkeeperAppPages;
                this.router.navigate(['shopkeeper-tabs']);
                
              } 
              if (user && user.roles.user && firebaseUser.emailVerified) {
                this.appPages = this.userAppPages;
                this.initilaizeuser();
                this.router.navigate(['user-tabs']);
                
                
              }
              if (user && user.roles.user && !firebaseUser.emailVerified) {
                this.appPages = this.nvuserAppPages;
                this.router.navigate(['user-tabs']);
                
                
              }
              this.userService.getUser().subscribe((newUser) => {
                this.user = newUser;
                // this.userData = newUser;
              });
            } else {
              this.router.navigate(['user']);
            }
          });
          this.userId = this.authService.currentUserId;
          this.fcmService.initPush(this.userId);
          
        // } else {
        //   console.log('not email verified');
        //   this.router.navigate(['verify-email']);
        // }
      } else {
        this.router.navigate(['auth']);
      }
    });
  }

  async viewTransactionDetails(id) {
    console.log(id);
    const modal = await this.modalController.create({
      component: TransactionDetailsPage,
      cssClass: 'overlay-modal',
      backdropDismiss: true,
      componentProps: {
        transactionId: id
      },
    });
    return await modal.present();
  }

  async requestUpgrade(){
    const alert = await this.alertController.create({
      header: '',
      message:
        'Are you sure you want to <strong>Upgrade</strong> as a shopkeeper?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Yes',
          handler: async () => {
          console.log('testtt');
          this.userService.shopKeeperRequest();
          },
        },
      ],
    });
    await alert.present();

  }
  async signOut() {
    const alert = await this.alertController.create({
      header: '',
      message:
        'Are you sure you want to <strong>Signout</strong> of the application?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Yes',
          handler: async () => {
            await this.authService.logout().then(() => {
              this.navCtrl.navigateRoot(['/auth/login']);
            })
            
          },
        },
      ],
    });
    this.translate.get('COMPONENT_USER_PAGE_HEADER').subscribe(res => {
      console.log(res);
      alert.header = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('COMPONENT_USER_PAGE_MESSAGE').subscribe(res => {
      // console.log(res);
      alert.message = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('COMPONENT_USER_PAGE_TEXT_YES').subscribe(res => {
      // console.log(res);
      (alert.buttons[1] as any).text = res;
      // this.userAppPages[0].title = res;
    });
    this.translate.get('COMPONENT_USER_PAGE_TEXT_CANCEL').subscribe(res => {
      // console.log(res);
      (alert.buttons[0] as any).text = res;
      // this.userAppPages[0].title = res;
    });
    await alert.present();

    // this.translation(alert);
  }

  // async translation(alert){
  //    }

  select(lng) {
    console.log(lng);
    this.languageService.setLanguage(lng);
    this.initializeSideMenu();
  }
  initilaizeuser(){

    this.transactions=[];
     this.transactionService.getLastTransactions().subscribe((res) => {
      this.transactions = res;
      this.transactions = this.transactions.filter(transaction => transaction.description !== 'Shop Creation');
      this.transactions = this.transactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'debit') );
      this.transactions = this.transactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'credit') );
      console.log('user transactionssss arre', this.transactions);});
  }
  initializeshop(){
    this.transactions=[];
    this.transactionService.getLastTransactions().subscribe((res) => {
      console.log(res);
      this.transactions = res;
      this.transactions = this.transactions.filter(transaction => transaction.description !== 'Bottle Registeration');
      this.transactions = this.transactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'credit') );
      this.transactions = this.transactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'debit') );
      console.log('shop transactions are', this.transactions);
    });
  
  }
  async Role(Role) {
    console.log(Role);
   
    
    if(Role=='User'){
      this.appPages = this.userAppPages;
      // this.initializeSideMenu(); 
      this.transactions=[];
       this.transactionService.getLastTransactions().subscribe((res) => {
        this.transactions = res;
        this.transactions = this.transactions.filter(transaction => transaction.description !== 'Shop Creation');
        this.transactions = this.transactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'debit') );
        this.transactions = this.transactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'credit') );
        console.log('user transactionssss arre', this.transactions);
      });
    
      this.router.navigate(['/user-tabs/home']);
    }
    else{
      this.initializeSideMenu();
      this.transactions=[];
      this.appPages = this.shopkeeperAppPages;
      this.transactionService.getLastTransactions().subscribe((res) => {
        console.log(res);
        this.transactions = res;
        this.transactions = this.transactions.filter(transaction => transaction.description !== 'Bottle Registeration');
        this.transactions = this.transactions.filter(transaction =>!( transaction.description=='Buy' && transaction.type === 'credit') );
        this.transactions = this.transactions.filter(transaction =>!( transaction.description=='Bottle Refill' && transaction.type === 'debit') );
        console.log('shop transactions are', this.transactions);
      });
      
      this.router.navigate(['/shopkeeper-tabs/home']);
    }
    
    // this.initializeSideMenu();
  }

  // initializeNotification(userId) {
  //   console.log("Notifications");

  //   this.platform.ready().then(() => {
  //     this.fcm.getToken(userId, "all");

  //     this.fcm.listenToNotifications().subscribe((data: any) => {
  //       // this.redirectFromNotification(data);
  //       console.log(data);
  //     });

  //     // this.fcm.listenToNotifications()
  //     // .subscribe((data: any) => {
  //     //   if(data.tap){
  //     //     console.log('data a tap');
  //     //     console.log(JSON.stringify(data));
  //     //     this.redirectFromNotification(data);
  //     //     // this.navCtrl.setRoot('NotificationsPage');
  //     //   }
  //     //   else {
  //     //     console.log('data b tap');
  //     //     console.log(JSON.stringify(data));
  //     //     const toast = this.toastCtrl.create({
  //     //       message: data.title,
  //     //       duration: 3000,
  //     //       showCloseButton: true,
  //     //       closeButtonText: "Show"
  //     //     });
  //     //     toast.onDidDismiss((data, role) => {
  //     //       if (role == "close") {
  //     //         this.navCtrl.push('NotificationsPage');
  //     //       }
  //     //     });
  //     //     toast.present();
  //     //   }
  //     // });
  //   });
  // }
}
