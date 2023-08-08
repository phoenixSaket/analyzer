import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AndroidService } from '../services/android.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-sentiment-reviews',
  templateUrl: './sentiment-reviews.component.html',
  styleUrls: ['./sentiment-reviews.component.css']
})
export class SentimentReviewsComponent implements OnInit {
  public isIOS: boolean = false;
  public reviews: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private android: AndroidService, private ios: IosService) { }

  ngOnInit(): void {
    console.log(this.data);

    this.isIOS = this.data.app.isIOS;
    const appId = this.isIOS ? this.data.app.appId : this.data.app.app.appId;

    if (this.isIOS) {
      this.getIOSReviews(appId)
    } else {
      this.getAndroidReviews(appId)
    }
  }

  getIOSReviews(app: any, page: number = 1) {
    this.ios.getAppReviews(app, 1, true).subscribe((response: any) => {

      const max = this.getMaxPages(JSON.parse(response.result).feed.link);
      for (let i = 1; i <= max; i++) {
        this.reallyGetIosReviews(app, i, max);
      }
    }, error => {
      this.ios.getAppReviews(app.appId, 1).subscribe((response: any) => {
        const max = this.getMaxPages(JSON.parse(response.result).feed.link);
        for (let i = 1; i <= max; i++) {
          this.reallyGetIosReviews(app.appId, i, max);
        }
      });
    });
  }

  getMaxPages(links: any[]) {
    let maxPage = 0;
    links.forEach((link: any) => {
      if (link.attributes.rel == "last") {
        const lk = link.attributes.href;
        const page = lk.toString().substring(lk.toString().indexOf("page=") + 5, lk.toString().indexOf("/", lk.toString().indexOf("page=") + 5));
        maxPage = page;
      }
    })
    return maxPage;
  }

  reallyGetIosReviews(id: any, page: number, max: number) {
    this.ios.getAppReviews(id, page).subscribe((response: any) => {
      let resp = JSON.parse(response.result)?.feed?.entry;
      if (resp?.length > 0) {
        resp.forEach((el: any) => {
          this.reviews.push(el);
        })
      }
      if (page == max) {
        this.filter();
      }
    })
  }

  getAndroidReviews(app: string) {
    this.android.getAppReviews(app, true).subscribe((response: any) => {
      const resp = JSON.parse(response.result).data;
      this.reviews = resp;
      this.filter();
    }, error => {
      this.android.getAppReviews(app).subscribe((response: any) => {
        const resp = JSON.parse(response.result).data;
        this.reviews = resp;
        this.filter();
      })
    })
  }

  filter() {
    this.reviews = JSON.parse(JSON.stringify(this.reviews)).filter((el: any) => {
      if (this.isIOS) {
        return el.content.label
          .toLowerCase()
          .includes(this.data.keyword.toLowerCase()) ||
          el.title.label.toLowerCase().includes(this.data.keyword.toLowerCase())
      } else {
        return el.text
          .toLowerCase()
          .includes(this.data.keyword.toLowerCase());
      }
    });

    let reviews = JSON.parse(JSON.stringify(this.reviews));
    let temp = [];
    this.data.ratings.forEach((ele: any) => {
      if (this.isIOS) {
        reviews.forEach((el: any) => {
          if (el['im:rating'].label == ele) {
            temp.push(el);
          }
        });
      } else {
        reviews.forEach((el: any) => {
          if (el.score == ele) {
            temp.push(el);
          }
        });
      }
    });

    this.reviews = temp;

    setTimeout(() => {
      this.highlight();
    }, 300);
  }

  highlight() {
    let titles = Array.from(<HTMLCollection>document.getElementsByClassName('reviews-container-sentiment'));
    const regex = new RegExp(this.data.keyword.toLowerCase(), 'gi');

    titles.forEach(title => {
      let text = title.innerHTML;
      text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');
      let newText = text.replace(
        regex,
        '<mark class="highlight">$&</mark>'
      );
      title.innerHTML = newText;
    })
  }

}
