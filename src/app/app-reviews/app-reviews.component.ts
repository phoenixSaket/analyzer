import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-app-reviews',
  templateUrl: './app-reviews.component.html',
  styleUrls: ['./app-reviews.component.css']
})
export class AppReviewsComponent implements AfterViewInit {
  public appData: any[] = [];
  public platform: boolean = false;
  public versions: any[];
  public years: any[];
  public versionSorted: any;
  public dateSorted: any;
  public ratingSorted: any;
  private currentApp: any;

  constructor(public data: DataService, private android: AndroidService, private ios: IosService) { }

  ngAfterViewInit(): void {
    this.data.appLoader.subscribe((resp: any) => {
      if (!!resp) {
        console.log("debug", resp);
        if (resp.isIOS) {
          this.platform = true;
          this.getIOSReviews(resp);
          this.currentApp = resp.app;
        } else {
          this.platform = false;
          this.android.getAppReviews(resp.app.appId).subscribe((data: any) => {
            console.log("data", JSON.parse(data.result));
            this.appData = JSON.parse(data.result).data;
            this.data.isLoading = false;
          })
        }
      }
    })
  }

  getIOSReviews(resp: any) {
    this.ios.getAppReviews(resp.app.id, 1).subscribe((response: any) => {
      let reviews = JSON.parse(response.result);
      this.appData = [];
      console.log("IOS Reviews", reviews.feed);
      this.getMaxPageNumber(reviews.feed.link).then((lastPageNumber: number) => {
        console.log("lastPageNumber", lastPageNumber);
        this.getSequentialReviews(lastPageNumber, 1);
      });
    })
  }

  getMaxPageNumber(links: any[]): Promise<number> {
    return new Promise((resolve) => {
      let lastPage = links.filter((link: any) => { return link.attributes.rel == "last" })[0].attributes.href.toString();
      let lastPageNumber = parseInt(lastPage.substring(lastPage.indexOf("page=") + 5, lastPage.indexOf("/", lastPage.indexOf("page=") + 5)));
      resolve(lastPageNumber);
    });
  }

  getSequentialReviews(total: number, index: number) {
    console.log("Sequence " + index + " / " + total);
    if (index <= total) {
      this.getSinglePageReviews(index).then((reviews: any) => {
        console.log("Ind Reviews", reviews);
        reviews.forEach(el => {
          this.appData.push(el);
        });
        console.log("total reviews", this.appData);
        if(index == total) {
          this.data.isLoading = false;
        }
        index = index + 1;
        this.getSequentialReviews(total, index);
      })
    } else {
      
    }
  }

  getSinglePageReviews(index: number): Promise<any> {
    return new Promise((resolve) => {
      this.ios.getAppReviews(this.currentApp.id, index).subscribe((reviews: any) => {
        console.log("Reviews", reviews);
        resolve(JSON.parse(reviews.result).feed.entry);
      })
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
