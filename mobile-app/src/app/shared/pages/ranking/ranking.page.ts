import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Data } from '@angular/router';
import { rankingI } from '@app/core/models/user-ranking';
@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {
 
  type;
  daily: Array<rankingI>=[];
   weekly: Array<rankingI>=[];
   monthly: Array<rankingI>=[];

  constructor(private afStore: AngularFirestore) {
    this.type='Daily';
   }
   
    
  ngOnInit() {
    let dailyRankings = this.afStore.collection('rankings', (ref) =>
    ref.orderBy('dailyco2', 'desc')).valueChanges();
    dailyRankings.subscribe((res: Array<rankingI>)=>{
    console.log('daily co2 is',res);
    this.daily=res;
    console.log(res.length);
   })
   let weeklyRankings = this.afStore.collection('rankings', (ref) =>
   ref.orderBy('weeklyco2', 'desc')).valueChanges();
   weeklyRankings.subscribe((res: Array<rankingI>)=>{
   console.log('weekly co2 is' ,res);
   this.weekly=res;
  })
  let monthlyRankings = this.afStore.collection('rankings', (ref) =>
  ref.orderBy('monthlyco2', 'desc')).valueChanges();
  monthlyRankings.subscribe((res: Array<rankingI>)=>{
  console.log('monthly co2 is' ,res);
  this.monthly=res;
 })
  }
  gotoProfile(uid){
    console.log('id is', uid);
  }
  segmentChanged(event) {
    console.log(event.detail.value);
    if (event.detail.value === 'Daily' && !this.daily) {
      this.daily;
    } else if (event.detail.value === 'Monthly' && !this.monthly) {
      this.monthly;
    } else if (event.detail.value === 'Total' && !this.weekly) {
      this.weekly;
    }
  }

}
