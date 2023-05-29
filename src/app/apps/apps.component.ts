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
  public startDeleting: boolean = false;
  public isComparing: boolean = false;
  public isDeleting: boolean = false;

  constructor(private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.apps = this.data.getTotalApps();
  }

  appSelected(app: any) {
    this.data.setCurrentApp(app);
    this.data.appSelected.next(true);
    this.data.setRecents(app);
    this.router.navigate(["/reviews"]);
  }

  startComparingApps() {
    if(this.startDeleting) this.startDeleting = false;
    this.startComparing = !this.startComparing;
  }

  startDeletingApps() {
    if(this.startComparing) this.startComparing = false;
    this.startDeleting = !this.startDeleting;
  }

  selectAppForComparing(app: any) {
    app.isComparing = !app.isComparing;
    if (app.isComparing) {
      this.data.setCompareApps(app);
    }
  }

  selectAppForDeleting(app: any) {
    app.isDeleting = !app.isDeleting;
    console.log("App for delete", app)
  }

  isComparingOrDeleting(): string {
    if(this.startComparing) {
      return "comparing";
    } else if (this.startDeleting) {
      return "deleting";
    } else {
      return "default";
    }
  }
}
