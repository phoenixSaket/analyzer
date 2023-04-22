import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public isOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  setActive(event: any) {
    Array.from(<HTMLCollection>document.getElementsByClassName("icon")).forEach((element: any)=> {
      element.classList.remove("active");
    });
    event.target.classList.add("active");
  }
}
