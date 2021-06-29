import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent implements OnInit {
  policies: any;
  constructor(
    private afStore: AngularFirestore
  ) { }

  ngOnInit() {
    this.policy();
  }
  async policy(){
    let terms;
    const bottles = this.afStore
        .collection('policies').doc('terms').valueChanges();
        bottles.subscribe(res=>{
          // console.log(res.payload.data());
          terms=res;
          this.policies=terms.conditions;
          // console.log(this.policies.conditions);
        })
  }

}
