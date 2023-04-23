import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ios',
  templateUrl: './app-ios.component.html',
  styleUrls: ['./app-ios.component.css']
})
export class AppIosComponent implements OnInit {

  @Input() data: any = {};
  public rating: any[] = [];
  constructor() { }

  ngOnInit(): void {
    let rating = this.data["im:rating"].label;

    for(let i = 1; i <= 5; i++) {
      if(i <= rating) {
        this.rating.push({shouldHighlight : true});
      } else {
        this.rating.push({shouldHighlight : false});
      }
    }
  }
}
