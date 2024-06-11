import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AndroidService } from 'src/app/services/android.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-details-android',
  templateUrl: './details-android.component.html',
  styleUrls: ['./details-android.component.css']
})
export class DetailsAndroidComponent implements OnInit {

  public window = window;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private android: AndroidService,
    private dataService: DataService,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.data.summary = this.data.summary.replaceAll('\n', '<br>');

    this.android.getApp(this.data.appId).subscribe((resp: any)=> {
      let response = JSON.parse(resp.result);
      this.data = {...this.data, screenshots: response.screenshots, reviews: response.reviews, ratings: response.ratings, summary: response.summary, description: response.descriptionHTML, installs : response.installs, developerWebsite: response.developerWebsite, contentRating: response.contentRating, primaryGenre: response.genre, updated: response.updated, version: response.version}
    })
  }


  addApp() {
    console.log(this.data);
    let shouldAddApp: boolean;
    shouldAddApp = this.saveToLocalStorage({ appId: this.data.appId, isIOS: false, app: this.data });
      if (shouldAddApp) {
        this.dialogRef.close();
        this.dataService.newAppAdded.next(true);
        let snackbarRef = this.snackbar.open("App Added", "Open Apps", {
          duration: 10000, horizontalPosition: "end",
          verticalPosition: "bottom",
          panelClass: "app-added-snackbar"
        });
        snackbarRef.onAction().subscribe(() => {
          this.router.navigate(["/apps"]);
        })
      } else {
        this.openSnackbar("App already present");
      }
  }

  saveToLocalStorage(app: any) {
    let shouldAddApp: boolean = true;
    let apps = JSON.parse(localStorage.getItem("apps-analyzer") || "[]");

    let check: boolean = false;
    apps.forEach((el: any) => {
      if (el.app.appId == app.app.appId && el.app.score == app.app.score) { check = true; shouldAddApp = false; };
    });

    if (!check) {
      apps.push(app);
    }

    localStorage.setItem("apps-analyzer", JSON.stringify(apps));
    return shouldAddApp;
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, "Close", {
      duration: 3000, horizontalPosition: "end",
      verticalPosition: "bottom",
    })
  }
}
