import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserI } from '@app/core/models/user';
import { TransactionI } from '@app/core/models/transaction';
import { ToastService } from '@app/core/services/toast.service';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { PopoverController } from '@ionic/angular';
import { rankingI } from '@app/core/models/user-ranking';
// import { PopoverPage } from '../popover/popover.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: UserI;
  userLoading = false;
  pla:any;
  co2: any;

  refills: Array<TransactionI>;
  refillsLoading = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private userService: UserService,
    private transactionService: TransactionService,
    // private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    this.getUser();
    this.getRefills();
    this.getranking();
  }
  addshop(){
    this.authService.currentUserObservable.subscribe(async user=>{
      await user.reload();
      if(user.emailVerified){
        this.router.navigate(['/shopkeeper-tabs/shops/add'])
      }
      else{
        this.router.navigate(['/non-verified'])
      }
    })

  }
  // async openLanguagePopover(ev) {
  //   const popover = await this.popoverCtrl.create({
  //     component: PopoverPage,
  //     event: ev
  //   });
  //   await popover.present();
  // }

  getUser() {
    this.userLoading = true;
    this.userService.getUser().subscribe(
      (user: UserI) => {
        this.user = user;
        this.userLoading = false;
      },
      (error) => {
        this.userLoading = false;
        console.error(error);
        this.toastService.presentToast(error.message);
      }
    );
  }

  getRefills() {
    this.refillsLoading = true;
    this.transactionService.getTransactions('credit', 'refill', 3).subscribe(
      (refills: Array<TransactionI>) => {
        this.refills = refills;
        this.refillsLoading = false;
      },
      (error) => {
        this.refillsLoading = false;
        console.error(error);
        this.toastService.presentToast(error.message);
      }
    );
  }

  getranking(){
    this.userService.getranking().subscribe((res:rankingI)=>{
      this.pla=res.weeklypla2;
      this.co2=res.weeklyco2;
      console.log(res);
    })
  }

  gotoUserProfile(userId) {
    console.log(userId);
    this.router.navigate(['/profile'], { queryParams: { id: userId } });
  }
}
