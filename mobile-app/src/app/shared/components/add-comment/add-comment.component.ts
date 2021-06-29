import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CurrentTimeService } from '@app/core/services/current-time.service';
import { RatingService } from '@app/core/services/rating.service';
import { ToastService } from '@app/core/services/toast.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit, OnDestroy {
  @Input() transactionId: string;
  @Input() shopkeeperID: string;
  @Input() userID: string;
  @Input() userName: string;
  @Input() userDisplayPicture: string;
  @Input() shopID: string;

  @Output() newItemEvent = new EventEmitter<string>();

  info: any;
  
  rateCommentObj = {
    transactionId: '',
    shopkeeperID: '',
    userID: '',
    userName: '',
    userDisplayPicture: '',
    shopID: '',
    comment: '',
    createdAt: null
  };
  // @Input() transactionId: string;
  constructor(private currentTime: CurrentTimeService, private modalController: ModalController,
    private toastService: ToastService, private ratingService: RatingService) { }

  ngOnInit() {
    console.log(this.transactionId);
    console.log(this.shopkeeperID);
    console.log(this.userID);
    console.log(this.userName);
    console.log(this.userDisplayPicture);
    console.log(this.shopID);
    this.rateCommentObj.transactionId = this.transactionId;
    this.rateCommentObj.shopkeeperID = this.shopkeeperID;
    this.rateCommentObj.userID = this.userID;
    this.rateCommentObj.userName = this.userName;
    this.rateCommentObj.userDisplayPicture = this.userDisplayPicture;
    this.rateCommentObj.shopID = this.shopID;
    this.rateCommentObj.createdAt = this.currentTime.getCurrentTime();
    console.log(this.rateCommentObj);
  }

  addNewItem() {
    this.newItemEvent.emit();
    console.log(this.info)
    this.rateCommentObj.comment = this.info;
    console.log(this.rateCommentObj);
  }
  ngOnDestroy() {
    // this.modalController.dismiss().then(() => {
    //   this.addNewItem();
    // });
    console.log('component destroy')
    this.rateCommentObj.comment = this.info;
    console.log(this.rateCommentObj);
    if(this.rateCommentObj.comment === '' || this.rateCommentObj.comment === undefined || this.rateCommentObj.comment === null) {
      this.toastService.presentToast('You dont have added any comment.');
    } else {
      console.log('nai khali');
      this.ratingService.addRating(this.rateCommentObj, this.transactionId).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  // dismissModal() {
  //   this.modalController.dismiss().then(() => {
  //     this.addNewItem();
  //   });
  // }
  data(event){
    // console.log(event.target.value);
    this.info = event.target.value;
    console.log(this.info);
    // this.test(this.info);
  }


}
