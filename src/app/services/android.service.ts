import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AndroidService {

  public url = "https://review-un6v.onrender.com/android/";
  public backupUrl = "https://review-un6v.onrender.com/android/";

  // public url = "https://reviews-be.cyclic.app/android/";
  // public backupUrl = "https://review-un6v.onrender.com/android/";

  public androidAppsDefault = [
    'com.ibx.ibxmobile',
    'com.ahnj.ahmobile',
    'com.ahatpa.ahamobile',
    'com.ibxtpa.iamobile',
    'com.ahc.ahcmobile'
  ];
  public histograms: any[] = [];

  constructor(private http: HttpClient) { }

  getApp(app: string, useBackup: boolean = false): Observable<any> {
    let url = (useBackup ? this.backupUrl : this.url) + "app";
    return this.http.post(url, { name: app.toLowerCase() });
  }

  getAppReviews(app: string, useBackup: boolean = false) {
    let url = (useBackup ? this.backupUrl : this.url) + "review";
    return this.http.post(url, { name: app.toLowerCase() });
  }

  searchApp(term: string, num: number, lang: string, price: string, useBackup: boolean = false) {
    let url = (useBackup ? this.backupUrl : this.url) + "search";
    return this.http.post(url, { term: term.toLowerCase(), num: num, lang: lang, price: price })
  }

  setHistogram(app: any, histogram: any) {
    if (!this.histograms.includes({ app: app.name, histogram: histogram })) {
      this.histograms.push({ app: app.name, histogram: histogram });
    }
  }

  getHistogram(appName: string): any {
    return this.histograms.find(app => { return app.app == appName });
  }

  sentimentAnalysis(text: string[]) {
    let url = "https://review-un6v.onrender.com/ios/" + "sentiment";
    return this.http.post(url, { string: text });
  }
}
