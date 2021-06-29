
import { Component, OnInit } from '@angular/core';
import { LanguageService } from '@app/core/services/language.service';

@Component({
  selector: 'app-language-toggle',
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.scss'],
})
export class LanguageToggleComponent implements OnInit {

  constructor(private language: LanguageService) { }

  ngOnInit() {}
  select(lng){
    this.language.setLanguage(lng);
  }

}
