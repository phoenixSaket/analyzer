import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  constructor(private data: DataService) { }

  ngOnInit(): void {
    let apps = this.data.getCompareApps();
    console.log("Apps", apps);
  }

}
