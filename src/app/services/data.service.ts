import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AndroidService } from './android.service';
import { IosService } from './ios.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public isLoading: boolean = false;
  public selectedApp;
  public newAppAdded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public appSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public compareApps: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public totalApps: any;
  public allApps: any[] = [];
  public appsToCompare: any[] = [];

  constructor(private http: HttpClient, private android: AndroidService, private ios: IosService, public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  setCurrentApp(app: any) {
    this.selectedApp = app;
  }

  getCurrentApp(): any {
    return JSON.parse(JSON.stringify(this.selectedApp));
  }

  setCompareApps(app: any) {
    this.appsToCompare = this.addIfNotPresent(app, JSON.parse(JSON.stringify(this.appsToCompare)));
  }
  
  getCompareApps(): any {
    return JSON.parse(JSON.stringify(this.appsToCompare));
  }

  addApp(app: any) {
    // console.log("Add app", app);
    this.allApps = this.getTotalApps();
    this.allApps.push(app);
    localStorage.setItem("apps-analyzer", JSON.stringify(this.allApps));
  }

  getTotalApps() {
    this.totalApps = JSON.parse(localStorage.getItem("apps-analyzer") || "[]");
    return this.totalApps
  }

  getTotalAppsLength() {
    this.totalApps = JSON.parse(localStorage.getItem("apps-analyzer") || "[]").length;
    return this.totalApps;
  }

  sendMailApi(email: string, apps: any[]) {
    let payload = { email: email, apps: JSON.stringify(apps) }
    return this.http.post("https://reviews-be.cyclic.app/save-apps", payload);
    // return this.http.post("http://localhost:8000/save-apps", payload);
  }

  newReviewsCheck() {

  }

  iosAlerts(reviews: any): any[] {
    return null;
  }

  androidAlerts(reviews: any) {

  }

  openNewReviewDialog() {
  }

  sendEmail(message: string, email: string) {
    let payload = { email: email, message: message }
    // return this.http.post("https://reviews-be.cyclic.app/save-apps", payload);
    return this.http.post("https://reviews-be.cyclic.app/mail/send", payload);
  }

  addIfNotPresent(entry: any, array: any[]): any[] {
    if (array.length > 0) {
      if (array.indexOf(entry) == -1) {
        array.push(entry);
      }
    } else {
      array.push(entry);
    }
    return array;
  }

  sortDescending(array: any[]): any[] {
    return array.sort((a: any, b: any) => {
      return b - a;
    });
  }
}
