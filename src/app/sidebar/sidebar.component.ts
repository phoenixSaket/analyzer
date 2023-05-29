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
        console.log("This is it", this.apps)
      }
    })

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
