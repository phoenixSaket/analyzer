import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";
import { ApexDataLabels, ApexPlotOptions, ApexTheme, ApexYAxis } from 'ng-apexcharts/lib/model/apex-types';
import { AndroidService } from '../services/android.service';
import { IosService } from '../services/ios.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public apps: any[] = [];

  public charts: any[] = [];
  public charts2: any[] = [];

  histogram: any[];
  total: any;

  constructor(private data: DataService, private android: AndroidService, private ios: IosService) {
  }

  ngOnInit(): void {
    this.apps = this.data.getTotalApps();
    this.apps.forEach((app) => {
      setTimeout(() => {
        this.loadCharts(app);
      }, 100);
    })
  }

  loadCharts(app: any) {
    this.data.isLoading = true;
    let chartOptions: any = {
      chart: {
        height: 350,
        type: "bar"
      },
      xaxis: {
        type: 'category',
        categories: ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"],
        labels: {
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            colors: '#1C2E4A'
          }
        }
      },
      yaxis: {
        show: false
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top", // top, center, bottom
            offSetY: -20
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            fontWeight: 800,
            colors: ['#1C2E4A'],
            fontFamily: 'Cabin, sans-serif'
          }
        },
      },
      colors: ["#B3BAD1", "#808CB3", "#2B4570", "#3D4766", "#363E59"]
    };

    let chartOptions2: any = {
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
          },
          offsetY: -20
        }
      },
      colors: ["#B3BAD1", "#808CB3", "#2B4570", "#3D4766", "#363E59"]
    };

    if (!!app) {
      if (app.isIOS) {
        this.ios.getApp(app.appId).subscribe((resp: any) => {
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

            chartOptions.series = [{
              data: ratings,
              name: "Ratings"
            }];

            chartOptions.app = app.app.title;
            chartOptions.isIOS = true;

            chartOptions2.series = values;
            chartOptions2.isIOS = true;
            chartOptions2.app = app.app.title;

            this.charts.push({ app: app.app.title, type: 'bar', isIOS: app.isIOS, bar: chartOptions, pie: chartOptions2, isVisible: 'bar' });

            setTimeout(() => {
              this.data.isLoading = false;
            }, 100);
          })
        })

      } else {
        this.android.getApp(app.appId).subscribe((resp: any) => {
          let histogram = JSON.parse(resp.result).histogram;
          let ratings: any[] = Object.values(histogram);
          this.histogram = ratings;
          let total = ratings.reduce((el, ab) => ab + el);
          this.total = total;
          let values = [];
          ratings.forEach(el => {
            values.push(parseFloat(((el * 100) / total).toFixed(2)));
          })

          chartOptions.series = [{
            data: ratings,
            name: "Ratings"
          }];

          chartOptions.app = app.app.title;
          chartOptions2.series = values;
          chartOptions2.app = app.app.title;

          this.charts.push({ app: app.app.title, type: 'bar', isIOS: app.isIOS, bar: chartOptions, pie: chartOptions2, isVisible: 'bar' });

          setTimeout(() => {
            this.data.isLoading = false;
          }, 100);
        });

      }
    }
  }

  drop(event: any) {
    console.log(event);
    moveItemInArray(this.charts, event.previousIndex, event.currentIndex);
  }

  changeChart(chart: any) {
    console.log(chart)
    if (chart.isVisible == 'pie') {
      chart.isVisible = 'bar';
    } else {
      chart.isVisible = 'pie';
    }
  }
}
