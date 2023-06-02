import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

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

  constructor(private data: DataService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.data.appsToCompare = [];
    this.apps = this.data.getTotalApps();
  }

  appSelected(app: any) {
    this.data.setCurrentApp(app);
    this.data.appSelected.next(true);
    this.data.setRecents(app);
    this.router.navigate(["/reviews"]);
  }

  startComparingApps() {
    if (this.startDeleting) this.startDeleting = false;
    this.startComparing = !this.startComparing;
    if (!this.startComparing) {
      this.data.appsToCompare = [];
      this.apps.forEach((app: any) => {
        app.isComparing = false;
      })
    } else {
      this.apps.forEach((app: any) => {
        app.isDeleting = false;
      })
    }
  }

  startDeletingApps() {
    if (this.startComparing) this.startComparing = false;
    this.startDeleting = !this.startDeleting;
    if (!this.startDeleting) {
      this.apps.forEach((app: any) => {
        app.isDeleting = false;
      })
    } else {
      this.data.appsToCompare = [];
      this.apps.forEach((app: any) => {
        app.isComparing = false;
      })
    }
  }

  selectAppForComparing(app: any) {
    app.isComparing = !app.isComparing;
    if (app.isComparing) {
      this.data.setCompareApps(app);
    }
  }

  selectAppForDeleting(app: any) {
    app.isDeleting = !app.isDeleting;
    console.log("App for delete", app);
  }

  deleteApps() {
    let temp: any[] = [];
    let deletingApps: any[] = [];

    this.apps.forEach((app: any) => {
      if (app.isDeleting) {
        deletingApps.push(app);
      }
    })

    const popupRef = this.dialog.open(PopupComponent, { data: deletingApps });
    popupRef.afterClosed().subscribe(() => {
      this.reset();
    })
  }
  
  reset() {
    this.apps = [];
    this.startComparing = false;
    this.startDeleting = false;
    this.isComparing = false;
    this.isDeleting = false;
    this.ngOnInit();
  }

  isComparingOrDeleting(): string {
    if (this.startComparing) {
      return "comparing";
    } else if (this.startDeleting) {
      return "deleting";
    } else {
      return "default";
    }
  }

  stopComparingOrDeleting() {
    this.startComparing = false;
    this.startDeleting = false;
    this.apps.forEach((app: any) => {
      app.isDeleting = false;
      app.isComparing = false
    })
  }
}
