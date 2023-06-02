import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { DetailsAndroidComponent } from './details-android/details-android.component';
import { DetailsComponent } from './details/details.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrls: ['./add-app.component.css']
})
export class AddAppComponent implements OnInit {

  public platforms: string[] = ['IOS', 'Android'];
  public appName: string = "";
  public apps: any[] = [];;
  public selectedPlatform: string = "IOS";

  constructor(private ios: IosService, private android: AndroidService, private dialog: MatDialog, private snackbar: MatSnackBar, private data: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  checked(item: string) {
    console.log(item);
    this.selectedPlatform = item;
    this.apps = [];
    this.searchApp(null);
  }

  searchApp(event: any) {
    if (!!event) {
      event.preventDefault();
    }
    let term: string = this.appName;
    const num: number = 20;
    const lang: string = "";
    const price: string = "";
    this.data.isLoading = true;
    if (this.selectedPlatform == "IOS") {
      this.ios.searchApp(term, num, lang, price).subscribe((resp: any) => {
        this.apps = JSON.parse(resp.result);
        this.data.isLoading = false;
      })
    } else {
      this.android.searchApp(term, num, lang, price).subscribe((resp: any) => {
        this.apps = JSON.parse(resp.result);
        this.data.isLoading = false;
      })
    }
  }

  inputApp(event: any) {
    this.appName = event.target.value;
  }

  openApp(app: any) {
    if (this.selectedPlatform == 'IOS') {
      this.dialog.open(DetailsComponent, { data: app })
    } else {
      this.dialog.open(DetailsAndroidComponent, { data: app })
    }
  }

  addApp(app: any) {
    let shouldAddApp: boolean;
    if (this.selectedPlatform == "IOS") {
      shouldAddApp = this.saveToLocalStorage({ appId: app.id, isIOS: this.selectedPlatform == "IOS", app: app });
      if (shouldAddApp) {
        this.data.newAppAdded.next(true);
        let snackBarRef = this.snackbar.open("App Added", "Open Apps", {
          duration: 10000, horizontalPosition: "end",
          verticalPosition: "bottom",
          panelClass: "app-added-snackbar"
        });
        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(["/apps"]);
        })
      } else {
        this.openSnackbar("App already present");
      }
    } else {
      shouldAddApp = this.saveToLocalStorage({ appId: app.appId, isIOS: this.selectedPlatform == "IOS", app: app });
      if (shouldAddApp) {
        this.data.newAppAdded.next(true);
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
