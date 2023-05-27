import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Chart, LinearScale } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import * as keyword_extractor from "keyword-extractor";
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
// import { WordDialogComponent } from '../word-dialog/word-dialog.component';

@Component({
  selector: 'app-sentiment-word-cloud',
  templateUrl: './sentiment-word-cloud.component.html',
  styleUrls: ['./sentiment-word-cloud.component.css']
})
export class SentimentWordCloudComponent implements OnInit {
  @ViewChild('wordCloudContainer', { static: false }) wordCloudContainer: ElementRef;

  public positiveChart: any;
  private appNames: any[] = [];
  public apps: any[] = [];
  private array: any[] = [];
  private reviews: any[] = [];
  public loading: boolean = false;
  public selectedApp: any = null;
  public words: any[] = [];
  public shouldWait: boolean = true;
  public currentApp: number = 0;
  public totalApps: number = 0;
  public sentiments: any;

  isSelected: boolean = false;
  appValue: any;
  expand: boolean = false;
  hasMulti: boolean;
  multi: number;

  constructor(
    private data: DataService,
    private ios: IosService,
    private android: AndroidService,
    public dialog: MatDialog
  ) {
    Chart.register(WordCloudController, WordElement, LinearScale);
  }

  ngOnInit(): void {
    this.apps = this.data.getTotalApps();
    this.totalApps = this.data.getTotalApps();
    this.positiveChart?.destroy();
    this.loading = false;
  }

  toggler() {
    this.expand = !this.expand;
  }

  appSelected(app: any, isInternalCall: boolean = true, shouldReloadApps: boolean = true, type: string = "multiple") {
    this.hasMulti = isInternalCall;
    this.isSelected = true;
    this.expand = false;
    this.appValue = app.app.title + "  " + (app.isIOS ? 'IOS' : 'Android');

    this.positiveChart?.destroy();
    this.selectedApp = app;
    this.reviews = [];
    this.array = [];
    this.loading = true;

    if (shouldReloadApps) {
      if (app.isIOS) {
        this.getIOSReviews(app.app, 1, "single");
      } else {
        this.getAndroidReviews(app.app, "single");
      }
    } else {
      this.generateSentimentWordCloud(this.words, this.multi, "single")
    }
  }

  getIOSReviews(app: any, page: number = 1, type: string) {
    this.ios.getAppReviews(app.id, 1, true).subscribe((response: any) => {

      const max = this.getMaxPages(JSON.parse(response.result).feed.link);
      for (let i = 1; i <= max; i++) {
        this.reallyGetIosReviews(app.id, i, max, type);
      }
    }, error => {
      this.ios.getAppReviews(app.appId, 1).subscribe((response: any) => {
        const max = this.getMaxPages(JSON.parse(response.result).feed.link);
        for (let i = 1; i <= max; i++) {
          this.reallyGetIosReviews(app.appId, i, max, type);
        }
      });
    });
  }

  getMaxPages(links: any[]) {
    let maxPage = 0;
    links.forEach((link: any) => {
      if (link.attributes.rel == "last") {
        const lk = link.attributes.href;
        const page = lk.toString().substring(lk.toString().indexOf("page=") + 5, lk.toString().indexOf("/", lk.toString().indexOf("page=") + 5));
        maxPage = page;
      }
    })
    return maxPage;
  }

  reallyGetIosReviews(id: any, page: number, max: number, type: string) {
    this.ios.getAppReviews(id, page).subscribe((response: any) => {
      let resp = JSON.parse(response.result).feed.entry;
      resp.forEach((el: any) => {
        this.reviews.push(el);
      })
      if (page == max) {
        setTimeout(() => {
          this.getKeywordData(this.reviews, true, type);
        }, 200);
      }
    })
  }

  getAndroidReviews(app: any, type: string) {
    this.android.getAppReviews(app.appId, true).subscribe((response: any) => {
      const resp = JSON.parse(response.result).data;
      resp.forEach((review: any) => {
        this.reviews.push(review.text);
      })
      this.getKeywordData(this.reviews, false, type);
    }, error => {
      this.android.getAppReviews(app.appId).subscribe((response: any) => {
        const resp = JSON.parse(response.result).data;
        resp.forEach((review: any) => {
          this.reviews.push(review.text);
        });
        this.getKeywordData(this.reviews, false, type);
      })
    })
  }

  generateWordCloud(data: any[], multlipicant: number) {
    console.log("Redrawing", this.multi)

    setTimeout(() => {
      const config = {
        data: {
          // text
          labels: data.map((d) => d.text),
          datasets: [
            {
              label: '',
              fit: false,
              maintainAspectRatio: true,
              // size in pixel
              data: data.map((d) => (d.number) * (this.multi)),
            },
          ]
        }
      };
      const canvas = <HTMLCanvasElement>(document.getElementById('positive-chart'));
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });
      this.positiveChart = new Chart(ctx, {
        type: WordCloudController.id,
        data: config.data,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          datasets: {
            wordCloud: {
              rotate: 0,
              padding: 3,
              fit: true,
              rotationSteps: 0,
              color: "#6DBCB7",
              showTooltips: false
            },
          }
        }
      });
      this.loading = false;
    }, 100);
  }

  generateSentimentWordCloud(data: any[], multlipicant: number, type: string) {

    setTimeout(() => {
      const config = {
        data: {
          // text
          labels: data.map((d) => d.text),
          datasets: [
            {
              label: '',
              fit: false,
              maintainAspectRatio: true,
              // size in pixel
              data: data.map((d) => (d.number) * (multlipicant)),
            },
          ]
        }
      };
      const canvas = <HTMLCanvasElement>(document.getElementById('positive-canvas'));
      const ctx = canvas?.getContext('2d', { willReadFrequently: true });
      let x = new Chart(ctx, {
        type: WordCloudController.id,
        data: config.data,
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          datasets: {
            wordCloud: {
              rotate: 0,
              padding: 1,
              fit: true,
              rotationSteps: 0,
              color: data.map((d) => {
                if (d.isPositive == null) {
                  return "#bcbcbc"
                } else if (d.isPositive) {
                  return "#8CA71D"
                } else {
                  return "#DC4333"
                }
              }),
              showTooltips: false
            },
          }
        }
      });

      this.positiveChart = x;
      this.loading = false;
      this.multi = multlipicant;
    }, 100);
  }

  getKeywordData(dataForExtraction: any[], isIos: boolean, type: string) {
    this.array = [];
    dataForExtraction.forEach((ent: any) => {
      if (isIos) {
        this.array.push(ent?.content?.label);
      } else {
        this.array.push(ent);
      }
    })

    let contentString = this.array.join(" ");

    let extract = keyword_extractor.default.extract(contentString, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
      return_max_ngrams: 1
    });
    let z: any[] = [];
    extract.forEach((el: any) => {
      let check = false;
      let i: number = 0;
      z.forEach((element, index) => {
        if (element.text == el) {
          check = true;
          i = index;
        }
      });
      if (check) {
        z[i].number = z[i].number + 1
      } else if (el !== 'app' && el != "apps" && el != this.selectedApp.app.title.toLowerCase()) {
        z.push({ text: el, number: 1 })
      }
    });

    if (z.length > 100) {
      z.sort((a: any, b: any) => {
        return b.number - a.number;
      });

      let temp: any[] = [];
      z.forEach((el: any, index: number) => {
        if (index < 150) {
          temp.push(el);
        }
      });

      z = temp;
    }

    this.words = z;

    let length = z[0].number;
    let multlipicant = (1024) / (length * 9);
    multlipicant = multlipicant > 0.5 ? multlipicant : 1 - multlipicant;
    multlipicant = multlipicant < 20 ? multlipicant : 20;
    this.multi = multlipicant;
    if (type == "single") {
      this.generateWordCloud(z, multlipicant);
    }
    let tempArr: any[] = [];
    if (this.array.length > 150) {
      this.array.forEach((el, index) => {
        if (index < 150) {
          tempArr.push(el);
        }
      })
    }
    this.ios.sentimentAnalysis(tempArr.length > 0 ? tempArr : this.array).subscribe((data: any) => {
      let sentArray = data.message;
      let positiveArray: string[] = [];
      let negativeArray: string[] = [];
      sentArray.forEach((el: any) => {
        el.sentiments.positive.forEach((positive: any) => {
          positiveArray.push(positive);
        })
        el.sentiments.negative.forEach((negative: any) => {
          negativeArray.push(negative);
        })
      });

      let tempArray: any[] = [];

      positiveArray.forEach((el: any) => {
        let check = false;
        let i: number = 0;
        tempArray.forEach((element, index) => {
          if (element.text == el) {
            check = true;
            i = index;
          }
        });
        if (check) {
          tempArray[i].number = tempArray[i].number + 1
        } else if (el !== 'app' && el != "apps" && el != this.selectedApp.app.title.toLowerCase()) {
          tempArray.push({ text: el, number: 1, isPositive: true })
        }
      });

      tempArray.sort((a: any, b: any) => {
        return b.number - a.number;
      });

      let temp: any[] = [];
      tempArray.forEach((el: any, index: number) => {
        if (index < 150) {
          temp.push(el);
        }
      });

      tempArray = temp;
      let arrayNew: any = {};
      arrayNew["positive"] = tempArray;
      tempArray = [];
      negativeArray.forEach((el: any) => {
        let check = false;
        let i: number = 0;
        tempArray.forEach((element, index) => {
          if (element.text == el) {
            check = true;
            i = index;
          }
        });
        if (check) {
          tempArray[i].number = tempArray[i].number + 1
        } else if (el !== 'app' && el != "apps" && el != this.selectedApp.app.title.toLowerCase()) {
          tempArray.push({ text: el, number: 1, isPositive: false })
        }
      });

      tempArray.sort((a: any, b: any) => {
        return b.number - a.number;
      });

      temp = [];
      tempArray.forEach((el: any, index: number) => {
        if (index < 150) {
          temp.push(el);
        }
      });

      tempArray = temp;

      arrayNew["negative"] = tempArray;
      this.sentiments = arrayNew;
      let array1 = arrayNew.positive,
        array2 = arrayNew.negative,
        result = [],
        i, l = Math.min(array1.length, array2.length);

      for (i = 0; i < l; i++) {
        result.push(array1[i], array2[i]);
      }
      result.push(...array1.slice(l), ...array2.slice(l));

      if (result.length > 150) {
        let y: any[] = [];
        result.forEach((el, index) => {
          if (index < 150) {
            y.push(el);
          }
        });
        result = y;
      }

      positiveArray = arrayNew.positive;
      negativeArray = arrayNew.negative;

      z.forEach((word: any) => {
        if (positiveArray.find((wordInner: any) => {
          let check: boolean = false;
          if (wordInner.text == word.text) {
            check = true;
          }
          return check
        })) {
          word.isPositive = true
        }

        if (negativeArray.find((wordInner: any) => {
          let check: boolean = false;
          if (wordInner.text == word.text) {
            check = true;
          }
          return check
        })) {
          word.isPositive = false
        }
      })


      let length = z[0].number;
      let multlipicant = (1024) / (length * 9);
      multlipicant = multlipicant > 0.5 ? multlipicant : 1 - multlipicant;
      multlipicant = multlipicant < 20 ? multlipicant : 20;
      this.generateSentimentWordCloud(z, multlipicant, "single");
    });
  }

  redraw() {
    this.positiveChart?.destroy();
    this.appSelected(this.selectedApp, true, false);
  }

  getWordReport() {
    // const dialogRef = this.dialog.open(WordDialogComponent, { data: { words: this.words, sentiments: this.sentiments } });
  }

  zoom() {
    this.multi = this.multi + (0.1 * this.multi);
    this.redraw();
  }

  zoomMinus() {
    this.multi = this.multi - (0.1 * this.multi);
    this.redraw();
  }

  saveWordCloud(): void {
    const canvas = document.createElement('canvas');
    const container = this.wordCloudContainer.nativeElement;

    canvas.width = container.width;
    canvas.height = container.height;

    const context = canvas.getContext('2d');
    context.drawImage(container, 0, 0);

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = this.selectedApp.app.title + '_sentiment_word_cloud.png';

    link.click();
  }

}
