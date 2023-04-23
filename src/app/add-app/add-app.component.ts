import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { DetailsAndroidComponent } from './details-android/details-android.component';
import { DetailsComponent } from './details/details.component';

@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrls: ['./add-app.component.css']
})
export class AddAppComponent implements OnInit {

  public platforms: string[] = ['IOS', 'Android'];
  public appName: string = "";
  public apps: any[] = [];;
  public platform: string = "";

  constructor(private ios: IosService, private android: AndroidService, private dialog: MatDialog, private snackbar: MatSnackBar, private data: DataService) { }

  ngOnInit(): void {
  }

  checked(item: string) {
    console.log(item);
    this.platform = item;
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
    if (this.platform == "IOS") {
      this.ios.searchApp(term, num, lang, price).subscribe((resp: any) => {
        console.log("resp", JSON.parse(resp.result));
        this.apps = JSON.parse(resp.result);
      })
    } else {
      this.android.searchApp(term, num, lang, price).subscribe((resp: any) => {
        console.log("resp", JSON.parse(resp.result));
        this.apps = JSON.parse(resp.result);
      })
    }
  }

  inputApp(event: any) {
    this.appName = event.target.value;
  }

  openApp(app: any) {
    console.log("Open", app);
    if (this.platform == 'IOS') {
      this.dialog.open(DetailsComponent, { data: app })
    } else {
      this.dialog.open(DetailsAndroidComponent, { data: app })
    }
  }

  addApp(app: any) {
    let shouldAddApp: boolean;
    if (this.platform == "IOS") {
      shouldAddApp = this.saveToLocalStorage({ appId: app.id, isIOS: this.platform == "IOS", app: app });
      if (shouldAddApp) {
        this.data.newAppAdded.next({ appId: app.id, isIOS: this.platform == "IOS", appName: app.title, app: app });
      } else {
        this.openSnackbar("App already present");
      }
    } else {
      shouldAddApp = this.saveToLocalStorage({ appId: app.appId, isIOS: this.platform == "IOS", app: app });
      if (shouldAddApp) {
        this.data.newAppAdded.next({ appId: app.appId, isIOS: this.platform == "IOS", appName: app.title, app: app });
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
      if (el.app == app.app) { check = true; shouldAddApp = false; };
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
