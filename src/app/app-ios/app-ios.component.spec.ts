import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIosComponent } from './app-ios.component';

describe('AppIosComponent', () => {
  let component: AppIosComponent;
  let fixture: ComponentFixture<AppIosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppIosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppIosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
