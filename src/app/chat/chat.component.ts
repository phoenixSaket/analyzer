import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  isSelected: boolean = false;
  appValue: any;
  expand: boolean = false;
  apps: any[] = [];
  selectedApp: any;
  loading: boolean = false;
  prompt: string = "";

  constructor(private data: DataService, private router: Router) { }

  ngOnInit(): void {
    this.apps = this.data.getTotalApps();
  }

  toggler() {
    this.expand = !this.expand;
  }

  appSelected(app: any, isInternalCall: boolean = true, shouldReload: boolean = true) {
    this.isSelected = true;
    this.expand = false;
    this.appValue = app.app.title + "  " + (app.isIOS ? 'IOS' : 'Android');

    this.selectedApp = app;
    this.loading = true;
  }

  addApp() {
    this.router.navigate(['/add'])
  }

  promptInput(event: any, type?: string) {
    try {
      console.log(type);
      this.prompt = event.target.value;
      console.log("prompt", this.prompt);
    } catch (err: any) {
      console.log("ChatComponent.promptInput caught an error: ", err);
    }
  }

}
