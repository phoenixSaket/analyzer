import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {
  public apps: any[] = []

  constructor(private data: DataService) { }

  ngOnInit(): void {
    // let apps = JSON.parse(localStorage.getItem("apps-analyzer") || "[]");

    // this.apps = apps;

    this.apps = this.data.getTotalApps();
  }

}
