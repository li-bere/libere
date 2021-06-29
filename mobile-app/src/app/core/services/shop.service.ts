import { LatLngI } from './../models/address';
import { ShopI } from './../models/shop';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

// import { ShopI } from '@app/core/models/shop';
import { CurrentTimeService } from '@app/core/services/current-time.service';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { Observable } from 'rxjs';
import { TransactionI } from '../models/transaction';
import { StorageService } from './storage.service';
import { shopRankingI } from '../models/shopRank';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(
    private afStore: AngularFirestore,
    private currentTimeService: CurrentTimeService,
    private authService: AuthService,
    private userService: UserService,
    private storageService: StorageService
  ) {}

  getAllShops() {
    return this.afStore
      .collection<ShopI>('shops')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as ShopI;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getShops() {
    return this.afStore
      .collection<ShopI>('shops', (ref) =>
        ref.where('shopkeeperUid', '==', this.authService.currentUserId)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as ShopI;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getShop(id: string) {
    console.log(id);
    return this.afStore.collection<ShopI>('shops').doc(id).valueChanges();
  }
   getShoplatLng(latLng: LatLngI) {
    // console.log("lat is " ,latLng.lat);
    // console.log("lat is " ,latLng.lng);
    return this.afStore
      .collection<ShopI>('shops', (ref) =>
        ref.where('address.latLng.lat', '==', latLng.lat)
            .where('address.latLng.lng', '==', latLng.lng)
      )
      .valueChanges()
    
  }
  getProfile(profileId) {
    return this.afStore
    .collection('shops')
    .doc<ShopI>(profileId)
    .valueChanges();
  }


  getShopBySid(sid: string) {
    return this.afStore
      .collection<ShopI>('shops', (ref) => ref.where('sid', '==', sid))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as ShopI;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  async createShop(shop: ShopI) {
    console.log(shop);
    
    const shops = await this.afStore
      .collection<ShopI>('shops', (ref) => ref.where('sid', '==', shop.sid))
      .valueChanges()
      .pipe(take(1))
      .toPromise();

      const shopid = await this.afStore
      .collection<ShopI>('shops', (ref) => ref.where('sid', '==', shop.sid))
      .snapshotChanges();
      shopid.subscribe(res=>{
        let sRanking: shopRankingI={
          id: res[0].payload.doc.id,
          shopId: shop.sid,
          name: shop.name,
          profilePic:null,
          dailyco2: 0,
          dailypla2:0,
          monthlypla2:0,
          monthlyco2:0,
          totalco2:0,
          totalpla2:0,
          }
          this.afStore.collection('Shop-rankings').doc(res[0].payload.doc.id).set(sRanking);
      })
    if (shops && shops.length > 0) {
      return Promise.reject({
        message: 'This shop id is not available, Kindly try another.',
      });
    }

    const currentTime = this.currentTimeService.getCurrentTime();
    shop.createdAt = currentTime;
    shop.updatedAt = currentTime;
    const user = await this.userService.getUser().pipe(take(1)).toPromise();
    shop.shopkeeperUid = user.uid;
    shop.shopkeeperName = user.firstName + ' ' + user.lastName;
    shop.shopkeeperDisplayPhoto = user.displayPhoto;
    shop.shopDisplayPhoto = '';
    return this.afStore.collection<ShopI>('shops').add(shop);
  }

  editShop(id: string, shop: ShopI) {
    const currentTime = this.currentTimeService.getCurrentTime();
    // shop.updatedAt = currentTime;
    return this.afStore
      .collection<ShopI>('shops')
      .doc(id)
      .set(shop, { merge: true });
  }

  updateShop(id: string, shopDisplayPhoto) {
    const currentTime = this.currentTimeService.getCurrentTime();
    // shop.updatedAt = currentTime;
    return this.afStore
      .collection<ShopI>('shops')
      .doc(id)
      .set(shopDisplayPhoto, { merge: true });
  }


  getstats(id){
    return this.afStore.collection<shopRankingI>('Shop-ranking').doc(id).valueChanges();

    
  }

  getShopTransactions(shopId, userId) {

    console.log(shopId, userId);
    const query= this.afStore.collection<TransactionI>('transactions', ref =>
    ref.where('shopId', '==', shopId)
    .where('to', '==', userId).orderBy('createdAt', 'desc')
    );
    return query.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as TransactionI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  async saveShopDisplayPhoto(shopId, photo: string) {
    try {
      const photPath = `shop/${shopId}.jpeg`;
      const ref = await this.storageService.saveFile(photPath, photo, {
        contentType: 'image/jpeg',
      });
      const shopDisplayPhoto = await ref.getDownloadURL().pipe(take(1)).toPromise();
      // const userData = await this.getUser().pipe(take(1)).toPromise();
      // const shopData = await this.getShop(shopId).pipe(take(1)).toPromise();
      // shopData.shopDisplayPhoto = downloadUrl;
      // await this.updateUser(userData);
      console.log(shopDisplayPhoto);
      this.updateShop(shopId, {shopDisplayPhoto});
      return;
    } catch (error) {
      throw error;
    }
  }

}
