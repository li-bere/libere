import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserTabsPage } from './user-tabs.page';

describe('UserTabsPage', () => {
  let component: UserTabsPage;
  let fixture: ComponentFixture<UserTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTabsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
