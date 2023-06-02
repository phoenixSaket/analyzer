import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dataService: DataService) { }

  ngOnInit(): void {
  }

  deleteApps() {
    const allApps = JSON.parse(JSON.stringify((this.dataService.getTotalApps())));
    let appsToDelete: any[] = this.data;
    let temp: any[] = [];

    allApps.forEach((app: any) => {
      appsToDelete.forEach((deleteApp: any) => {
        if (app.app.appId != deleteApp.app.appId) {
          temp.push(app);
        }
      })
    });

    localStorage.setItem("apps-analyzer", JSON.stringify(temp));
  }

}
