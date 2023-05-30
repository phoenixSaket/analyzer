import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  public dataToShow: any[] = [
    [
      "App Details",
      "Platform",
      "Average Ratings",
      "Developer",
      "Genre",
      "Current Version",
      "Release Date",
      "Last Updated",
      "Total Reviews",
      "Total Ratings",
      "1 ★",
      "2 ★",
      "3 ★",
      "4 ★",
      "5 ★",
    ]
  ];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    let apps = this.data.getCompareApps();
    console.log("Apps", apps);

    apps.forEach((element: any) => {
      let data: any[] = [];
      data.push(
        element.app.title,
        element.isIOS ? 'IOS': 'Android',
        element.app.score,
        element.app.developer,
        element.app.genre || "Genre",
        element.app.version,
        new Date(element.app.released).toDateString(),
        new Date(element.app.updated).toDateString(),
        element.app.reviews,
        "Ratings",
        "1",
        "2",
        "3",
        "4",
        "5",
      );
      this.dataToShow.push(data);
    });
  }

}
