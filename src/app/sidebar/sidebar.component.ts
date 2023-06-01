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

    this.data.checkRecents.subscribe((shouldCheck: boolean)=> {
      if(shouldCheck) {
        this.apps = this.data.getRecents();
      }
    });

    if(this.apps.length == 0) {
      this.apps = [];
      let apps = this.data.getTotalApps();
      for (let index = 0; index < apps.length; index++) {
        const app = apps[index];
        if(index < 5) {
          this.apps.push(app);
        } else {
          break;
        }
      }
      this.data.recents = JSON.parse(JSON.stringify(this.apps));
    }

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
