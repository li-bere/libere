import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './../../../core/services/toast.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { LocationViewComponent } from '../location-view/location-view.component';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent implements OnInit {
  @ViewChild('canvas') private canvasElement: HTMLCanvasElement;
  @ViewChild(LocationViewComponent) private locationViewComponent: LocationViewComponent;
  
  @Input() shopSid: string;
  qrData = '';
  qrDownloadBtnDisabled = true;
  loading=true;
  qrCodeOptions = {
    elementType: 'canvas',
    scale: 8
  };
  constructor(private modalCtrl: ModalController,
              private toastService: ToastService,
              private translate: TranslateService) { }

  ngOnInit() {
    console.log(this.shopSid);
    const data = {
      shopSid: this.shopSid,
      type: 'shop'
    }
    this.qrData = JSON.stringify(data);
    this.qrDownloadBtnDisabled = false;
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
  async downloadQRCode() {
    console.log(this.canvasElement);
    this.loading = true;
    try {
      const imgData = await this.canvasElement.toDataURL('image/jpeg');
      console.log(imgData);
      const data = imgData.split(',')[1];

      const fileName = 'libere-qr-code-' + new Date().getTime() + '.jpeg';
      await Filesystem.writeFile({
        data,
        path: fileName,
        directory: FilesystemDirectory.Documents,
      });

      console.log(FilesystemDirectory.Documents);
      console.log(FilesystemDirectory.ExternalStorage);

      this.loading = false;
      this.toastService.presentToast(
        'Your qr code has been saved in the gallery.'
      );
    } catch (error) {
      console.error(error);
      this.loading = false;
      this.translate.get('PAGE_VIEW_ERROR_MSG_ERROR_QR_CODE').subscribe(res => {
        this.toastService.presentToast(res);
      });
      // this.toastService.presentToast('Could not save the qr code');
    }
  }

}
