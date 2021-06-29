import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddBottlePage } from './add-bottle.page';

describe('AddBottlePage', () => {
  let component: AddBottlePage;
  let fixture: ComponentFixture<AddBottlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBottlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBottlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
