import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
} from "ng-apexcharts";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  public chartOptions: any;

  public dataToShow: any[] = [
    [
      "App Details",
      "Platform",
      "Average Ratings",
      "Developer",
      "Genre",
      "Current Version",
      "Release Date",
      "Last Updated",
      "Total Ratings",
      "1 ★",
      "2 ★",
      "3 ★",
      "4 ★",
      "5 ★",
    ]
  ];
  series: any[] = [];

  constructor(private data: DataService, private ios: IosService, private router: Router) { }

  ngOnInit(): void {

    let apps = this.data.getCompareApps();
    if (apps.length == 0) {
      this.router.navigate(["/apps"]);
      return;
    }

    apps.forEach((element: any) => {
      let data: any[] = [];

      if (element.isIOS) {
        this.ios.getApp(element.appId).subscribe((response: any) => {
          const appData = JSON.parse(response.result);
          element.app.genre = appData.genres.join(", ");
          this.ios.getAPPRatings(element.appId).subscribe((resp: any) => {
            let histogram = JSON.parse(resp.result).histogram;
            const total = histogram["1"] + histogram["2"] + histogram["3"] + histogram["4"] + histogram["5"];
            data.push(
              element.app.title,
              element.isIOS ? 'IOS' : 'Android',
              element.app.score,
              element.app.developer,
              element.app.genre,
              element.app.version,
              new Date(element.app.released).toDateString(),
              new Date(element.app.updated).toDateString(),
              total,
              { rating: histogram["1"], percent: ((histogram["1"] * 100) / total).toFixed(0) },
              { rating: histogram["2"], percent: ((histogram["2"] * 100) / total).toFixed(0) },
              { rating: histogram["3"], percent: ((histogram["3"] * 100) / total).toFixed(0) },
              { rating: histogram["4"], percent: ((histogram["4"] * 100) / total).toFixed(0) },
              { rating: histogram["5"], percent: ((histogram["5"] * 100) / total).toFixed(0) }
            );

            let histogramPercent = [
              ((histogram["1"] * 100) / total).toFixed(0),
              ((histogram["2"] * 100) / total).toFixed(0),
              ((histogram["3"] * 100) / total).toFixed(0),
              ((histogram["4"] * 100) / total).toFixed(0),
              ((histogram["5"] * 100) / total).toFixed(0)
            ];

            this.dataToShow.push(data);
            this.loadChart(histogramPercent, element.app.title);
          });
        })
      } else {

      }

    });
  }

  initCharts() {
    this.chartOptions = {
      series: this.series,
      chart: {
        type: "bar",
        height: "100%"
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
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: "rounded",
          dataLabels: {
            position: "top", // top, center, bottom
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: '12px',
              fontWeight: 800,
              colors: ['#1C2E4A'],
              fontFamily: 'Cabin, sans-serif'
            }
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
      stroke: {
        show: false,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "1 ★",
          "2 ★",
          "3 ★",
          "4 ★",
          "5 ★"
        ],
        title: {
          text: "Apps",
          style: {
            fontSize: '16px',
            fontWeight: 800,
            colors: ['#1C2E4A'],
            fontFamily: 'Cabin, sans-serif'
          }
        },
        style: {
          fontSize: '16px',
          fontWeight: 800,
          colors: ['#1C2E4A'],
          fontFamily: 'Cabin, sans-serif'
        }
      },
      yaxis: {
        title: {
          text: "Ratings in Percent",
          style: {
            fontSize: '16px',
            fontWeight: 800,
            colors: ['#1C2E4A'],
            fontFamily: 'Cabin, sans-serif'
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toFixed(0);
          }
        }
      },
      colors: ["#B3BAD1", "#808CB3", "#2B4570", "#3D4766", "#363E59"]
    };
  }

  loadChart(histogram: any, name: string) {
    this.series.push({
      name: name,
      data: histogram,
      style: {
        fontSize: '12px',
        fontWeight: 800,
        colors: ['#1C2E4A'],
        fontFamily: 'Cabin, sans-serif'
      }
    });
    this.initCharts();
  }

}
