import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAppComponent } from './add-app/add-app.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "add", component: AddAppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
