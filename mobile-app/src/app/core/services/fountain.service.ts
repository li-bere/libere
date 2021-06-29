import { LatLngI } from '@app/core/models/address';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { map, take } from 'rxjs/operators';

import { FountainI } from '@app/core/models/fountain';

import * as geofirestore from 'geofirestore';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';
// import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class FountainService {
  geoFirestoreApp = geofirestore.initializeApp(firebase.firestore());

  constructor(
    private afStore: AngularFirestore,
    private storage: Storage
  ) { }

  getAll() {
    return this.afStore
      .collection<FountainI>('updatedFountains')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as FountainI;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getAllFountains() {
    const data = this.afStore.collection<FountainI>('fountains').snapshotChanges();
    data.subscribe(async res => {
      for (let i = 0; i < res.length; i++) {
      //  console.log(res[i].payload.doc.data().address.latLng.lat);
      //  console.log(res[i].payload.doc.data().address.latLng.lng);
       let fountainsAddress = res[i].payload.doc.data();
       let leti = res[i].payload.doc.data().address.latLng.lat;
       let long = res[i].payload.doc.data().address.latLng.lng;
       await this.addFountainsTo(leti, long, fountainsAddress);
       console.log(i);
      }

     });
     }
    //  setlocal() {
    //    console.log("set local");
    //   const data = this.afStore.collection<FountainI>('newFountains').valueChanges();
    //   data.subscribe(async res => {
    //     console.log("updated fountains are",res.length);
      
        
    //    });
      
    //    }
      //  getlocal(){
      //   //  this.setlocal();
      //    let fountains=[];
      //    console.log(" in local storage");
      //    this.storage.get('newfountains').then(async (val)=>{
      //     console.log("total fountains are",val.length);
      //     let count: any;
      //     for(let i=0;i<val.length;i++){
      //       count=0;
      //     for(let j=0;j<fountains.length;j++){
      //       if(val[i].g.geohash==fountains[j].g.geohash){
      //         count=1;
      //       }
           
      //     }
      //     if(count==0){
          
      //       fountains.push(val[i])
      //     }
      //     else{
      //       console.log(count);
      //     }
      //     }
      //     console.log("fountains length is ",fountains.length)
      //     // this.addFountains(fountains);
      //     // await this.storage.set('newfountains',fountains);
      //    })
      //  }
//  addFountains() {
//   //  this.setlocal();
//   const geocollection = this.geoFirestoreApp.collection('newFountains');
//   this.storage.get('newfountains').then( async fountain=>{
//     console.log("total fountains are",fountain.length);
//     for(let i=78000;i<=fountain.length;i++){
//       let fountainsAddress=fountain[i].fountainsAddress;
//       let latlng=fountainsAddress.latLng;
//       let lat=latlng.lat;
//       let lng=latlng.lng;
//       // console.log(lat);
//       // console.log(address);
//       await geocollection.add({
//         fountainsAddress,
//           coordinates: new firebase.firestore.GeoPoint(lat,lng)
//         }).then((result) => {
//           console.log(i);
//           console.log(result);
//         });
  
//     }
   
//   });
  
 
//     // const fountainAdd = this.geoFirestoreApp.collection('fountainss');
//     // const geocollection = this.geoFirestoreApp.collection('fountainss');
//     // for(let i=0;i<fountain.length; i++){
//     //   console.log(fountain[i]);
      
//     //   await geocollection.add({
//     //       fountain[i],
//     //       coordinates: new firebase.firestore.GeoPoint(leti, longi)
//     //     }).then((result) => {
//     //       console.log(result);
//     //     });
//     // }
    
//   }
addFountainSuggestion(fountain) {
    const fountainSuggestionRef = this.afStore.collection('fountain-suggestions');
    return fountainSuggestionRef.add(fountain);
  }

  async addFountainsTo(leti, longi, fountainsAddress) {
    /* const firestore = firebase.firestore();
    const GeoFirestore = geofirestore.initializeApp(firestore); */
    const geocollection = this.geoFirestoreApp.collection('allNewFountains');
    await geocollection.add({
        fountainsAddress,
        coordinates: new firebase.firestore.GeoPoint(leti, longi)
      }).then((result) => {
        console.log(result);
      });
  }

  getNearByFountains(lat, lng, radius = 20) {
    const geocollection = this.geoFirestoreApp.collection('newFountains');
    const query = geocollection.near({ center: new firebase.firestore.GeoPoint(lat, lng), radius });
    const cordinate = query.get();
    return cordinate;
  }
  getFountains() {
    const geocollection = this.geoFirestoreApp.collection('newFountains').get();
    // const query = geocollection.near({ center: new firebase.firestore.GeoPoint(lat, lng), radius });
    // const cordinate = query.get();
    return geocollection;
  }
  getNearByzoomedFountains(lat, lng, radius) {
    const geocollection = this.geoFirestoreApp.collection('newFountains');
    const query = geocollection.near({ center: new firebase.firestore.GeoPoint(lat, lng), radius });
    const cordinate = query.get();
    return cordinate;
  }


  /* getNearByFountainsAfterDrag(lat, lng) {
    // const firestore = firebase.firestore();
    // const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = this.geoFirestoreApp.collection('allNewFountains');
    const query = geocollection.near({ center: new firebase.firestore.GeoPoint(lat, lng), radius: 10 });
    const cordinate = query.get();
    return cordinate;
  }

 
  getRadius(rad) {
    // const firestore = firebase.firestore();
    // const GeoFirestore = geofirestore.initializeApp(firestore);
    const geocollection = this.geoFirestoreApp.collection('allNewFountains');
    const query = geocollection.near({ center: new firebase.firestore.GeoPoint(45.74261271607039, 9.603791936772081), radius: rad });
    const cordinate = query.get();
    return cordinate;
  } */

}
