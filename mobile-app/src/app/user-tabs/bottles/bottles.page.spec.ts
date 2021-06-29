import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BottlesPage } from './bottles.page';

describe('BottlesPage', () => {
  let component: BottlesPage;
  let fixture: ComponentFixture<BottlesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottlesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BottlesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
