import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {
  public apps: any[] = [];
  public startComparing: boolean = false;
  public isComparing: boolean = false;

  constructor(private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.apps = this.data.getTotalApps();
  }

  appSelected(app: any) {
    this.data.setCurrentApp(app);
    this.data.appSelected.next(true);
    this.router.navigate(["/reviews"]);
  }

  startComparingApps() {
    console.log(this.startComparing)
    this.startComparing = !this.startComparing;
  }

  selectAppForComparing(app: any) {
    app.isComparing = !app.isComparing;
    if(app.isComparing) {
      this.data.setCompareApps(app);
    }
  }
}
