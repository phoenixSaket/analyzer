import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAppComponent } from './add-app/add-app.component';
import { AppReviewsComponent } from './app-reviews/app-reviews.component';
import { AppsComponent } from './apps/apps.component';
import { HomeComponent } from './home/home.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { WordCloudComponent } from './word-cloud/word-cloud.component';
import { SentimentWordCloudComponent } from './sentiment-word-cloud/sentiment-word-cloud.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompareComponent } from './compare/compare.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "add", component: AddAppComponent },
  { path: "apps", component: AppsComponent },
  { path: "reviews", component: ReviewsComponent },
  { path: "app-reviews", component: AppReviewsComponent },
  { path: "word-cloud", component: WordCloudComponent },
  { path: "sentiment-word-cloud", component: SentimentWordCloudComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "compare", component: CompareComponent },  
  { path: "chat", component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
