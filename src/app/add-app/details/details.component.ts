import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})

export class DetailsComponent implements OnInit {

  public window = window;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private snackbar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.data.description = this.data.description.replaceAll('\n', '<br>');
  }

  addApp() {
    console.log(this.data);
    let shouldAddApp: boolean;
    shouldAddApp = this.saveToLocalStorage({ appId: this.data.id, isIOS: true, app: this.data });
    if (shouldAddApp) {
      this.dialogRef.close();
      this.dataService.newAppAdded.next(true);
      let snackBarRef = this.snackbar.open("App Added", "Open Apps", {
        duration: 10000, horizontalPosition: "end",
        verticalPosition: "bottom",
        panelClass: "app-added-snackbar"
      });
      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(["/apps"]);
      })
    } else {
      this.openSnackbar("App already present");
    }
  }

  saveToLocalStorage(app: any) {
    let shouldAddApp: boolean = true;
    let apps = JSON.parse(localStorage.getItem("apps-analyzer") || "[]");

    let check: boolean = false;
    apps.forEach((el: any) => {
      if (el.app.appId == app.app.appId && el.app.score == app.app.score) { check = true; shouldAddApp = false; };
    });

    if (!check) {
      apps.push(app);
    }

    localStorage.setItem("apps-analyzer", JSON.stringify(apps));
    return shouldAddApp;
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, "Close", {
      duration: 3000, horizontalPosition: "end",
      verticalPosition: "bottom",
    })
  }
}
