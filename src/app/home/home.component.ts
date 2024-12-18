import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public features: any[] = [
    { title: "Dashboard", text: "Pie & Bar charts for the ratings received by your apps", icon: "dashboard" },
    { title: "Add Apps", text: "Add any app from Google Play Store and Apple App Store", icon: "add" },
    { title: "Word Clouds", text: "Generate word clouds for based on the reviews & sentiments", icon: "cloud" },
    { title: "Monitor Apps", text: "Stay updated with the latest ratings and reviews for your added apps", icon: "sentiment_satisfied" },
    { title: "Sort & Filter", text: "Sort and filter your apps with versions, years, ratings, keyword", icon: "filter" },
    { title: "Compare Apps", text: "Compare apps with the market and the competitors", icon: "compare_arrows" },
    { title: "New Reviews Popup", text: "Get a popup with the reviews of your apps received while you were away", icon: "open_in_new" }
  ];

  public images: any[] = ["https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/1.jpg",
    "https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/2.jpg",
    "https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/3.jpg",
    "https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/4.jpg",
    "https://raw.githubusercontent.com/phoenixSaket/reviews/main/src/assets/Images/5.jpg"];

  public selectedImgIndex: number = 0;

  constructor(public data: DataService) { }

  ngOnInit(): void {
    // this.rotator();
  }

  rotator() {
    let localthis = this;

    function rotate() {
      if (localthis.images.length - 1 > localthis.selectedImgIndex) {
        localthis.selectedImgIndex += 1;
      } else {
        localthis.selectedImgIndex = 0;
      }
      localthis.rotator();
    }

    setTimeout(() => {
      rotate();
    }, 3000)
  }

  download(link: string) {
    let page = '';
    switch (link) {
      case "android": page = "https://github.com/phoenixSaket/reviews/blob/main/src/assets/apps/reviews-dashboard.apk?raw=true";
        break;
      case "ios": page = "https://github.com/phoenixSaket/reviews/blob/main/src/assets/apps/ios_source.tar.gz?raw=true"
        break;
    }
    window.open(page, '_blank');
  }

}
