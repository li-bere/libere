import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AntiFloodComponent } from './anti-flood.component';

describe('AntiFloodComponent', () => {
  let component: AntiFloodComponent;
  let fixture: ComponentFixture<AntiFloodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntiFloodComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AntiFloodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
