import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public isOpen: boolean = false;
  public apps: any[] = [];

  constructor(private data: DataService, private router: Router) { }

  ngOnInit(): void {
    // this.data.newAppAdded.subscribe((data: any) => {
    //   if (!!data) {
    //     console.log("App", data);
    //     apps.push(data);
    //   }
    // })

    // this.apps = apps;

    // this.apps = this.data.getTotalApps();
    let apps = JSON.parse(JSON.stringify(this.data.getTotalApps()));

    apps.forEach((app: any, index: number) => {
      if (index < 5) {
        this.apps.push(app);
      }
    })
    this.data.newAppAdded.subscribe((isAdded: boolean) => {
      if (isAdded) {
        // this.apps = this.data.getTotalApps();
        let apps = JSON.parse(JSON.stringify(this.data.getTotalApps()));

        apps.forEach((app: any, index: number) => {
          if (index < 5) {
            this.apps.push(app);
          }
        })
        console.log(this.apps);
      }
    });

  }

  setActive(event: any) {
    Array.from(<HTMLCollection>document.getElementsByClassName("icon")).forEach((element: any) => {
      element.classList.remove("active");
    });
    event.target.classList.add("active");
  }

  selectApp(app: any) {
    this.data.setCurrentApp(app);
    this.data.appSelected.next(true);
    this.router.navigate(["/reviews"]);
  }
}
