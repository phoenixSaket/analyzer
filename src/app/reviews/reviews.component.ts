import { Component, OnInit, ViewChild } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke,
  ApexFill
} from "ng-apexcharts";
import { ApexDataLabels, ApexPlotOptions, ApexTheme, ApexYAxis } from 'ng-apexcharts/lib/model/apex-types';

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

  constructor(private data: DataService, private ios: IosService, private android: AndroidService) {
    this.chartOptions = {
      chart: {
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
        width: 400,
        type: "pie"
      },
      labels: ["1★", "2★", "3★", "4★", "5★"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
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
    this.data.appLoader.subscribe((app: any) => {
      if (!!app) {
        console.log("Selected app", app);
        if (app.isIOS) {
          this.ios.getApp(app.appId).subscribe((resp: any) => {
            console.log("resp ios", JSON.parse(resp.result));
          })
        } else {
          this.android.getApp(app.appId).subscribe((resp: any) => {
            console.log("resp android", JSON.parse(resp.result));
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
          })
        }
      }
    });
  }

}
