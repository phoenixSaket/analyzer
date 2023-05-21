import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public isOpen: boolean = false;
  public apps: any[] = [];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    // this.data.newAppAdded.subscribe((data: any) => {
    //   if (!!data) {
    //     console.log("App", data);
    //     apps.push(data);
    //   }
    // })

    // this.apps = apps;

    this.apps = this.data.getTotalApps();
  }

  setActive(event: any) {
    Array.from(<HTMLCollection>document.getElementsByClassName("icon")).forEach((element: any) => {
      element.classList.remove("active");
    });
    event.target.classList.add("active");
  }

  selectApp(app: any) {
    // this.data.appLoader.next(app);
    this.data.setCurrentApp(app);
  }
}
