import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(public functions: AngularFireFunctions,) { }

  transferCredits(data: any) {
    console.log(data);
    const callable = this.functions.httpsCallable('transferCredits');
    return callable(data);
  }
}
