import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { shopRankingI } from '@app/core/models/shopRank';

@Component({
  selector: 'app-shop-ranking',
  templateUrl: './shop-ranking.page.html',
  styleUrls: ['./shop-ranking.page.scss'],
})
export class ShopRankingPage implements OnInit {
  type;
  daily: Array<shopRankingI>=[];
   total: Array<shopRankingI>=[];
   monthly: Array<shopRankingI>=[];
  constructor(private afStore: AngularFirestore) {
    this.type='Daily';
   }
   
    
  ngOnInit() {
    let dailyRankings = this.afStore.collection('Shop-rankings', (ref) =>
    ref.orderBy('dailyco2', 'desc')).valueChanges();
    dailyRankings.subscribe((res: Array<shopRankingI>)=>{
    console.log('daily co2 is',res);
    this.daily=res;
    console.log(res.length);
   })
   let totalRankings = this.afStore.collection('Shop-rankings', (ref) =>
   ref.orderBy('totalco2', 'desc')).valueChanges();
   totalRankings.subscribe((res: Array<shopRankingI>)=>{
   console.log('total co2 is' ,res);
   this.total=res;
  })
  let monthlyRankings = this.afStore.collection('Shop-rankings', (ref) =>
  ref.orderBy('monthlyco2', 'desc')).valueChanges();
  monthlyRankings.subscribe((res: Array<shopRankingI>)=>{
  console.log('monthly co2 is' ,res);
  this.monthly=res;
  
 })

}
segmentChanged(event) {
  console.log(event.detail.value);
  if (event.detail.value === 'Daily' && !this.daily) {
    this.daily;
  } else if (event.detail.value === 'Monthly' && !this.monthly) {
    this.monthly;
  } else if (event.detail.value === 'Total' && !this.total) {
    this.total;
  }
}
}
