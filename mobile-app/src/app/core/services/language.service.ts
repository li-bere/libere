import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase/app';
import { Storage } from '@ionic/storage';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
  constructor(private translate: TranslateService, private storage: Storage) { }
  setInitialAppLanguage() {
    const language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    this.storage.get(LNG_KEY).then(val => {
      if (val) {
        this.setLanguage(val);
        this.selected = val;
      }
    });
  }

  getLanguages() {
    return [
      {text: 'Italian', value: 'it', img: 'assets/m1.png'},
      {text: 'English', value: 'en', img: 'assets/m2.png'},
    ];
  }

  // '.fr' '.en' ...
  setLanguage(lng) {
    firebase.auth().languageCode = lng;
    this.translate.use(lng);
    this.selected = lng;
    this.storage.set(LNG_KEY, lng);

  }
}
