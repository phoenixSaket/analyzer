import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentWordCloudComponent } from './sentiment-word-cloud.component';

describe('SentimentWordCloudComponent', () => {
  let component: SentimentWordCloudComponent;
  let fixture: ComponentFixture<SentimentWordCloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentimentWordCloudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentWordCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
