import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { BehaviorSubject } from 'rxjs';
import { AndroidService } from './android.service';
import { IosService } from './ios.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public isLoading: boolean = false;
  public selectedApp;
  totalApps: any[] = [];

  constructor(private http: HttpClient, private android: AndroidService, private ios: IosService, public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  setCurrentApp(app: any) {
    this.selectedApp = app;
  }

  getCurrentApp(): any {
    return this.selectedApp;
  }

  getCurrentPage(): string {
    return null;
  }

  setCurrentPage(page: string) {
  }

  addApp(app: any) {
    this.totalApps.push(app);
    localStorage.setItem("apps-analyzer", JSON.stringify(this.totalApps));
  }

  getTotalApps() {
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
}
