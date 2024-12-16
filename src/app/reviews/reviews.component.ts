import { Component, OnInit, ViewChild } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";
import { ApexDataLabels, ApexPlotOptions, ApexTheme, ApexYAxis } from 'ng-apexcharts/lib/model/apex-types';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { GenerativeService, platform, promptKeywords } from '../services/generative.service';
import * as showdown from 'showdown';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[]
};

export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  plotOptions: ApexPlotOptions;
  theme: ApexTheme;
  colors: string[]
};

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions2>;
  public appData: any = {};
  public histogram: any[] = [];
  public total: number = 0;

  genAI = {
    latestReviewLoading: true,
    latestReview: "",
    issuesLoading: true,
    issues: "",
    improvementsLoading: true,
    improvements: "",
    summaryLoading: true,
    summary: "" 
  };

  expand = {
    issues: false,
    improvements: false,
    summary: false,
    latestReview: false
  };

  constructor(
    public data: DataService, 
    private ios: IosService, 
    private android: AndroidService, 
    private router: Router, 
    public dialog: MatDialog,
    private generative: GenerativeService
  ) {
    this.chartOptions = {
      chart: {
        // width: '100%',
        height: 350,
        type: "bar",
      },
      xaxis: {
        categories: ["1★", "2★", "3★", "4★", "5★"]
      },
      yaxis: {
        show: false
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top" // top, center, bottom
          }
        }
      },
      colors: ["#54628C"]
    };
    this.chartOptions2 = {
      chart: {
        // width: '350',
        // height: '100%',
        type: "pie"
      },
      labels: ["1★", "2★", "3★", "4★", "5★"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 320
            },
            legend: {
              position: "bottom"
            }
          }
        },
        {
          breakpoint: 1000,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        },
        {
          breakpoint: 2160,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        },
        {
          breakpoint: 750,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        },
      ],
      theme: {
        monochrome: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top" // top, center, bottom
          }
        }
      },
      colors: ["#B3BAD1", "#808CB3", "#54628C", "#3D4766", "#363E59"]
    };
  }

  ngOnInit(): void {
    try {
      this.data.appSelected.subscribe((newAppSelected: boolean) => {
        if (newAppSelected) {
          this.resetValues();
          let app = this.data.selectedApp;
          this.data.isLoading = true;
          if (!!app) {
            if (app.isIOS) {
              this.ios.getApp(app.appId).subscribe((resp: any) => {
                this.appData = JSON.parse(resp.result);
                this.ios.getAPPRatings(app.appId).subscribe((response: any) => {
                  let histogram = JSON.parse(response.result).histogram;
                  let ratings: any[] = Object.values(histogram);
                  this.histogram = ratings;
                  let total = ratings.reduce((el, ab) => ab + el);
                  this.total = total;
                  let values = [];
                  ratings.forEach(el => {
                    values.push(parseFloat(((el * 100) / total).toFixed(2)));
                  })
                  this.chartOptions.series = [{
                    data: ratings,
                    name: "Ratings"
                  }];
                  // this.chartOptions.title = { ...this.chartOptions, text: JSON.parse(resp.result).title };
                  this.chartOptions.dataLabels = {
                    enabled: true,
                    offsetY: -20,
                    style: {
                      fontSize: "12px",
                      colors: ["#304758"]
                    }
                  }

                  this.chartOptions2.series = values;
                  setTimeout(() => {
                    this.data.isLoading = false;
                  }, 100);
                })
              });
            } else {
              this.android.getApp(app.appId).subscribe((resp: any) => {
                this.appData = JSON.parse(resp.result);
                let histogram = JSON.parse(resp.result).histogram;
                let ratings: any[] = Object.values(histogram);
                this.histogram = ratings;
                let total = ratings.reduce((el, ab) => ab + el);
                this.total = total;
                let values = [];
                ratings.forEach(el => {
                  values.push(parseFloat(((el * 100) / total).toFixed(2)));
                })
                this.chartOptions.series = [{
                  data: values,
                  name: "Ratings"
                }];
                // this.chartOptions.title = { ...this.chartOptions, text: JSON.parse(resp.result).title };
                this.chartOptions.dataLabels = {
                  enabled: true,
                  formatter: function (val) {
                    return val + "%";
                  },
                  offsetY: -20,
                  style: {
                    fontSize: "12px",
                    colors: ["#304758"]
                  }
                }

                this.chartOptions2.series = values;
                setTimeout(() => {
                  this.data.isLoading = false;
                }, 100);
              });
            }
          }
          this.getGenAiData(app);
        } else {
          this.router.navigate(["/"]);
        }
      });
    } catch (err: any) {
      console.log("ReviewsComponent.ngOnInit caught an error:", err);
    }
  }

  resetValues() {
    this.genAI = {
      latestReviewLoading: true,
      latestReview: "",
      issuesLoading: true,
      issues: "",
      improvementsLoading: true,
      improvements: "",
      summaryLoading: true,
      summary: "" 
    };
  
    this.expand = {
      issues: false,
      improvements: false,
      summary: false,
      latestReview: false
    };
  }

  getGenAiData(app: any) {
    const keywords = promptKeywords;

    keywords.forEach((key: string) => {
      this.generative.getSummaryV2(key, app.appId, "", app.isIOS ? platform.ios : platform.android).subscribe((response: any) => {
        switch (key) {
          case "summary":
            this.genAI.summary = this.formatContent(response.message);
            this.genAI.summaryLoading = false;
            break;
          case "issues":
            this.genAI.issues = this.formatContent(response.message);
            this.genAI.issuesLoading = false;
            break;
          case "improvements":
            this.genAI.improvements = this.formatContent(response.message);
            this.genAI.improvementsLoading = false;
            break;
          case "latest":
            this.genAI.latestReview = this.formatContent(response.message);
            this.genAI.latestReviewLoading = false;
            break; 
          default:
            break;
        };
      });
    })
  }

  formatContent(content: string): string {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(content);
    return html;
  }

  openReviews() {
    this.router.navigate(["/app-reviews"]);
  }

  deleteApp() {
    let temp: any[] = [];
    let deletingApps: any[] = [this.data.selectedApp];

    const popupRef = this.dialog.open(PopupComponent, { data: deletingApps });
    popupRef.afterClosed().subscribe(() => {
      this.router.navigate(["/apps"]);
    })
  }

  expandContent(type: string) {
    switch (type) {
      case "issues":
        this.expand.issues = !this.expand.issues;
        break;
      case "improvements":
        this.expand.improvements = !this.expand.improvements;
        break;
      case "summary":
        this.expand.summary = !this.expand.summary;
        break;
      case "latestReview":
        this.expand.latestReview = !this.expand.latestReview;
        break;
      default:
        break;
    }
  }

}
