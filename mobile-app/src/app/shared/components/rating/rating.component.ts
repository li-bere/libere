import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColorsI } from '@app/core/constants/colors.enum';
import { CurrentTimeService } from '@app/core/services/current-time.service';
import { LoadingService } from '@app/core/services/loading.service';
import { RatingService } from '@app/core/services/rating.service';
import { ShopService } from '@app/core/services/shop.service';
import { ToastService } from '@app/core/services/toast.service';
import { TransactionService } from '@app/core/services/transaction.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AddCommentComponent } from '../add-comment/add-comment.component';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  @Input() childMessage: string;
  // @Input() rating: number ;
  // @Output() ratingChange: EventEmitter<number> = new EventEmitter();
  dataForRating: any;
  // ratingValue: number;
  // ratingObserver: Subscription;
  hasRating = false;
  // ratingValueRate = { ratingValue: 0 };
  // ratingLoaded = false;
  rate: any;
  rateComment: any;
  loading = false;

  
  ratingForm: FormGroup;
  formValue = { comment: ''};

  ratingObj: any;
 
  constructor(private currentTimeService: CurrentTimeService,
              private ratingService: RatingService,
              private transactionService: TransactionService,
              private alertCtrl: AlertController,
              private toastService: ToastService,
              private loadingService: LoadingService,
              private modalController: ModalController) {
                this.ratingForm = new FormGroup({
                  // rate: new FormControl(this.formValue.rate, [
                  //   Validators.required,
                  // ]),
                  comment: new FormControl(this.formValue.comment, [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(100)
                  ])
                });
              }

  // get rating() { return this.ratingForm.get('rate'); }
  get comment() { return this.ratingForm.get('comment'); }

  ngOnInit() {
    console.log(this.childMessage);
    this.transactionService.getTransaction(this.childMessage).subscribe(res => {
      console.log(res);
      this.dataForRating = res;
    });
    this.loading = true;
    this.getRating();
    this.loading = false;
  }

  async viewCommentBox() {
    // console.log(id);
    // console.log(id, "id is");
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: AddCommentComponent,
      cssClass: 'custom-comment-modal',
      backdropDismiss: true,
      componentProps: {
        shopkeeperID: this.dataForRating.shopkeeperUid,
        userID: this.dataForRating.userUid,
        userName: this.dataForRating.userName,
        userDisplayPicture: this.dataForRating.userDisplayPhoto,
        shopID: this.dataForRating.shopId,
        // createdAt: this.currentTimeService.getCurrentTime(),
        transactionId: this.childMessage
        // rateValue: ratinFormValue.rate,
        // comment: ''
      },
    });
    return await modal.present();
  }

  // async popupComment(){
    // let alert = this.alertCtrl.create({
      
    //   inputs: [
    //     {
    //       name: 'comment',
    //       type: 'text',
    //       value: this.rateComment
          
    //     },
       
    //   ],
    //   buttons: [
       
    //     {
    //       text: 'Submit',
    //       handler: data => {
    //         this.submitRating(data);
    //       }
    //     }
    //   ]
    // });
    // (await alert).present();
  // }

  submitRating(ratinFormValue) {
    // console.log(ratinFormValue);
      let ratingData = {
      shopkeeperID: this.dataForRating.shopkeeperUid,
      userID: this.dataForRating.userUid,
      userName: this.dataForRating.userName,
      userDisplayPicture: this.dataForRating.userDisplayPhoto,
      shopID: this.dataForRating.shopId,
      createdAt: this.currentTimeService.getCurrentTime(),
      // rateValue: ratinFormValue.rate,
      // comment: ''
    };
    // this.ratingObj = ratingData;
    console.log(ratingData);
    this.loading = true;
      this.ratingService.addRating(ratingData, this.childMessage).then((res) => {
          console.log(res);
          this.loading = false;
          this.toastService.presentToast('Feedback added');
        },
        error => {
          console.log(error);
        }
      );
  }



  async onModelChange(ev) {
    console.log(ev);
    await this.loadingService.presentLoading('');
    let ratingData = {
      shopkeeperID: this.dataForRating.shopkeeperUid,
      userID: this.dataForRating.userUid,
      userName: this.dataForRating.userName,
      userDisplayPicture: this.dataForRating.userDisplayPhoto,
      shopID: this.dataForRating.shopId,
      createdAt: this.currentTimeService.getCurrentTime(),
      rateValue: ev,
      // comment: ratinFormValue.comment
    };

    this.ratingService
      .addRating(ratingData, this.childMessage)
      .then(
        async (res) => {
          console.log(res);
          await this.loadingService.dismissLoader();
          this.toastService.presentToast('Rating added');
        },
        error => {
          console.log(error);
        }
      );
  }

   getRating() {
    this.ratingService
      .getRating(this.childMessage)
      .subscribe(
        (rating: any) => {
          console.log(rating);
          if (rating !== undefined && rating !== null) {
            this.hasRating = true;
            console.log(rating.rateValue);
            this.rate = rating.rateValue;
            console.log(this.rate);
            this.rateComment = rating.comment;
          } else {
            this.hasRating = false;
          }
        },
        error => {
          console.log(error);
        }
      );
  }
  

}
