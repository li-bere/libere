import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopRankingPage } from './shop-ranking.page';

describe('ShopRankingPage', () => {
  let component: ShopRankingPage;
  let fixture: ComponentFixture<ShopRankingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopRankingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopRankingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
