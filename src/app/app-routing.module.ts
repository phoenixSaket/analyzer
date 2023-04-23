import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAppComponent } from './add-app/add-app.component';
import { AppReviewsComponent } from './app-reviews/app-reviews.component';
import { AppsComponent } from './apps/apps.component';
import { HomeComponent } from './home/home.component';
import { ReviewsComponent } from './reviews/reviews.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "add", component: AddAppComponent },
  { path: "apps", component: AppsComponent },
  { path: "reviews", component: ReviewsComponent },
  { path: "app-reviews", component: AppReviewsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
