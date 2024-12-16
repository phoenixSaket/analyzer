import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { ChatRequest, ChatResponse, GenerativeService, InitiateChatRequest } from '../services/generative.service';

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
  isAppSelected: boolean = false;
  history: any;

  // promt variables
  message: string = "";
  content: string = "";

  // chat cutton to send message // when it should be disabled
  isButtonDisabled: boolean = true;

  // predefined prompts
  preDefinedPrompts: string[] = [
    "What can the AI chat tool do ?",
    "Summarize reviews",
    "Identify improvements",
    "Latest version reviews",
    "Identify issues"
  ];

  userPrompts: string[] = [];

  constructor(private data: DataService, private router: Router, private genrativeService: GenerativeService) { }

  ngOnInit(): void {
    this.apps = this.data.getTotalApps();
    this.loading = false;

  }

  toggler() {
    this.expand = !this.expand;
  }

  appSelected(app: any, isInternalCall: boolean = true, shouldReload: boolean = true) {
    this.loading = true;
    this.selectedApp = {appName: app.app.title, isIOS: app.isIOS};
    this.expand = false;
    this.isAppSelected = true;
    this.appValue = app.app.title + ' (' + (app.isIOS ? 'IOS' : 'Android') + ')';
    this.isSelected = true;

    console.log(app)

    let request: InitiateChatRequest = {
      id: app.app.id,
      platform: app.isIOS ? "ios": "android"
    }

    this.genrativeService.initiateChat(request).subscribe((response: ChatResponse) => {
      this.loading = false;
      if (response.opstatus == 0) {
        this.history = response.history;
        console.log(response);
      }
    })
  }

  addApp() {
    this.router.navigate(['/add'])
  }

  promptInput(event: any) {
    try {
      if (!this.isAppSelected) {
        this.isButtonDisabled = true;
        return;
      }
  
      if (event.key.toLowerCase() == "enter" && !this.isButtonDisabled) {
        this.sendMessage();
        return;
      }
  
      let value = event.target.value;
      if (value.length > 0) {
        this.message = value;
        this.isButtonDisabled = false;
      } else {
        this.message = "";
        this.isButtonDisabled = true;
      }
    } catch (err: any) {
      console.log("ChatComponent.promptInput caught an error: ", err);
    }
  }

  sendMessage() {
    this.loading = true;
    
    let request: ChatRequest = {
      message: this.message,
      history: this.history
    };
    
    this.genrativeService.chat(request).subscribe((response: ChatResponse) => {
      this.message = "";
      this.loading = false;
      this.history = response.history;
      setTimeout(() => {
        document.getElementById("messages").scrollTo(0, document.getElementById("messages").scrollHeight);
      }, 10);
    })
  }

  changePrompt(prompt: string) {
    let type = this.getType(prompt);
    this.message = type;    
    
    this.sendMessage();
  }

  getType(prompt: string): string {
    let r = "";
    switch (prompt) {
      case "Summarize reviews":
        r = "summarize all the reviews for me";
        break;
      case "Latest version reviews":
        r = "get me the reviews for the latest version based on the reviews provided";
        break;
      case "Identify improvements":
        r = "identify the improvements for me based on the reviews provided";
        break;
      case "Identify issues":
        r = "identify the issues for me based on the reviews provided";
        break;
      case "What can the AI chat tool do ?":
        r = "what can you do for me based on the reviews provided in general";
        break;
      default:
        r = prompt;
        break;
    }
    return r;
  }

}
