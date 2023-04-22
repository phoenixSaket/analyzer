import { Component, OnInit } from '@angular/core';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrls: ['./add-app.component.css']
})
export class AddAppComponent implements OnInit {

  public platforms: string[] = ['IOS', 'Android'];
  public appName: string = "";
  public apps: any[] = [];;

  constructor(private ios: IosService) { }

  ngOnInit(): void {
  }

  checked(item: string) {

  }

  searchApp(event: any) {
    event.preventDefault();
    let term: string = this.appName;
    const num: number = 20;
    const lang: string = "";
    const price: string = "";
    this.ios.searchApp(this.appName, num, lang, price).subscribe((resp: any) => {
      console.log("resp", JSON.parse(resp.result));
      this.apps = JSON.parse(resp.result);
    })
  }

  inputApp(event: any) {
    this.appName = event.target.value;
  }
}
