import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AndroidService } from 'src/app/services/android.service';

@Component({
  selector: 'app-details-android',
  templateUrl: './details-android.component.html',
  styleUrls: ['./details-android.component.css']
})
export class DetailsAndroidComponent implements OnInit {

  public window = window;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private android: AndroidService) { }

  ngOnInit(): void {
    this.data.summary = this.data.summary.replaceAll('\n', '<br>');

    this.android.getApp(this.data.appId).subscribe((resp: any)=> {
      let response = JSON.parse(resp.result);
      console.log(response);
      this.data = {...this.data, screenshots: response.screenshots, reviews: response.reviews, ratings: response.ratings, summary: response.summary, description: response.descriptionHTML, installs : response.installs, developerWebsite: response.developerWebsite, contentRating: response.contentRating, primaryGenre: response.genre, updated: response.updated, version: response.version}
    })
  }

}
