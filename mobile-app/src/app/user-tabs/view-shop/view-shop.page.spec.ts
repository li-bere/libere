import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewShopPage } from './view-shop.page';

describe('ViewShopPage', () => {
  let component: ViewShopPage;
  let fixture: ComponentFixture<ViewShopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewShopPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewShopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
