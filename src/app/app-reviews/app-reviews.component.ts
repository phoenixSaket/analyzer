import { Component, OnInit } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-app-reviews',
  templateUrl: './app-reviews.component.html',
  styleUrls: ['./app-reviews.component.css']
})
export class AppReviewsComponent implements OnInit {
  public appData: any[] = [];
  public platform: boolean = false;
  public versions: any[];
  public years: any[];
  public versionSorted: any;
  public dateSorted: any;
  public ratingSorted: any;
  private appId: string = "";

  constructor(private data: DataService, private android: AndroidService, private ios: IosService) { }

  ngOnInit(): void {
    this.data.appLoader.subscribe((resp: any) => {
      if (!!resp) {
        console.log("debug",resp);
        if (resp.isIOS) {
          this.platform = true;
        } else {
          this.platform = false;
          if(this.appId == "" || this.appId != resp.app.appId) {
            this.appId = resp.app.appId;
            this.android.getAppReviews(resp.app.appId).subscribe((data: any) => {
              console.log("data", JSON.parse(data.result));
              this.appData = JSON.parse(data.result).data;
            })
          }
        }
      }
    })
  }

  search(event: any) {

  }

  versionFilter(event: any) {

  }

  yearFilter(event: any) {

  }

  ratingFilter(event: any) {

  }

  sortFilter(event) {

  }

}
