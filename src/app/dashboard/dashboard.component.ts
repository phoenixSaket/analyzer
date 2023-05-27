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

  public charts: Partial<ChartOptions>[] = [];

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
        // width: '100%',
        height: 350,
        type: "bar",
      },
      xaxis: {
        categories: ["1★", "2★", "3★", "4★", "5★"]
      },
      yaxis: {
        type: "numeric",
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
          style: {
            colors: ['#54628C']
          },
          offsetY: -30
        },
      },
      dataLabels : {
        enabled: true,
          style: {
            colors: ['#ff0000']
          },
          offsetY: -30,
        },
        colors: ["#54628C"]
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
      colors: ["#B3BAD1", "#808CB3", "#54628C", "#3D4766", "#363E59"]
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
              data: values,
              name: "Ratings"
            }];

            chartOptions.plotOptions.dataLabels = {
              formatter: function (val) {
                return val + "%";
              }
            }

            chartOptions.app = app.app.title;
            chartOptions.isIOS = true;            
            this.charts.push(chartOptions);

            chartOptions2.series = values;
            chartOptions2.isIOS = true;
            chartOptions2.app = app.app.title;

            this.charts.push(chartOptions2);
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
            data: values,
            name: "Ratings"
          }];
          chartOptions.dataLabels = {
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

          chartOptions.app = app.app.title;
          chartOptions.isIOS = false;
          this.charts.push(chartOptions);
          
          chartOptions2.series = values;
          chartOptions2.app = app.app.title;
          chartOptions2.isIOS = false;
          this.charts.push(chartOptions2);

          setTimeout(() => {
            this.data.isLoading = false;
          }, 100);
        });

      }
    }
  }
}
