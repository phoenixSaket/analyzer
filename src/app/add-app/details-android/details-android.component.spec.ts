import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAndroidComponent } from './details-android.component';

describe('DetailsAndroidComponent', () => {
  let component: DetailsAndroidComponent;
  let fixture: ComponentFixture<DetailsAndroidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsAndroidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsAndroidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
