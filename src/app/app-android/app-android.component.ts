import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-android',
  templateUrl: './app-android.component.html',
  styleUrls: ['./app-android.component.css']
})
export class AppAndroidComponent implements OnInit {

  @Input() data: any = {};
  @Input() view: string;
  public rating: any[] = [];

  constructor() { }

  ngOnInit(): void {
    let rating = this.data.score;

    for(let i = 1; i <= 5; i++) {
      if(i <= rating) {
        this.rating.push({shouldHighlight : true});
      } else {
        this.rating.push({shouldHighlight : false});
      }
    }
  }


}
