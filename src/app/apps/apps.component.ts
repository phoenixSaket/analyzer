import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {
  public apps: any[] = []

  constructor() { }

  ngOnInit(): void {
    let apps = JSON.parse(localStorage.getItem("apps-analyzer") || "[]");

    this.apps = apps;
  }

}
