import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { AddAppComponent } from './add-app/add-app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from './add-app/details/details.component';
import { DetailsAndroidComponent } from './add-app/details-android/details-android.component';
import { AppsComponent } from './apps/apps.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AppReviewsComponent } from './app-reviews/app-reviews.component';
import { AppAndroidComponent } from './app-android/app-android.component';
import { AppIosComponent } from './app-ios/app-ios.component';
import { FiltersComponent } from './filters/filters.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { LoaderComponent } from './loader/loader.component';
import { WordCloudComponent } from './word-cloud/word-cloud.component';
import { SentimentWordCloudComponent } from './sentiment-word-cloud/sentiment-word-cloud.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompareComponent } from './compare/compare.component';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    AddAppComponent,
    DetailsComponent,
    DetailsAndroidComponent,
    AppsComponent,
    ReviewsComponent,
    AppReviewsComponent,
    AppAndroidComponent,
    AppIosComponent,
    FiltersComponent,
    LoaderComponent,
    WordCloudComponent,
    SentimentWordCloudComponent,
    DashboardComponent,
    CompareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule,
    MatChipsModule,
    NgApexchartsModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    DragDropModule
  ],
  exports: [
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
