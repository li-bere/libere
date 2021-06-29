import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestFountainRegistryPage } from './request-fountain-registry.page';

describe('RequestFountainRegistryPage', () => {
  let component: RequestFountainRegistryPage;
  let fixture: ComponentFixture<RequestFountainRegistryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestFountainRegistryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestFountainRegistryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
