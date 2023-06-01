import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import * as keyword_extractor from 'keyword-extractor';
import { Chart, LinearScale } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { AndroidService } from '../services/android.service';
import { IosService } from '../services/ios.service';

@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.css']
})
export class WordCloudComponent implements OnInit {
  @ViewChild('wordCloudContainer', { static: false }) wordCloudContainer: ElementRef;

  public chart: any;
  public apps: any[] = [];
  public selectedApp: any;
  public isSelected: boolean = false;
  public expand: boolean = false;
  public appValue: any;
  totalApps: any;
  currentApp: any;
  reviews: any[];
  array: any[];
  loading: boolean;
  words: any[];
  multiplicant: number = 0;
  multi: number = 0;

  constructor(private data: DataService, private android: AndroidService, private ios: IosService) {
    Chart.register(WordCloudController, WordElement, LinearScale);
  }

  ngOnInit(): void {
    this.apps = this.data.getTotalApps();
    this.totalApps = this.data.getTotalApps();
    this.chart?.destroy();
    this.loading = false;
  }

  toggler() {
    this.expand = !this.expand;
  }

  appSelected(app: any, isInternalCall: boolean = true, shouldReload: boolean = true) {
    this.isSelected = true;
    this.expand = false;
    this.appValue = app.app.title + "  " + (app.isIOS ? 'IOS' : 'Android');

    this.chart?.destroy();
    this.selectedApp = app;
    this.reviews = [];
    this.array = [];
    this.loading = true;

    if(shouldReload) {
      if (app.isIOS) {
        this.getIOSReviews(app.app);
      } else {
        this.getAndroidReviews(app.app);
      }
    } else {
      this.generateWordCloud(this.words, this.multiplicant);
    }
  }

  getIOSReviews(app: any, page: number = 1) {
    this.ios.getAppReviews(app.id, 1, true).subscribe(
      (response: any) => {
        const max = this.getMaxPages(JSON.parse(response.result).feed.link);
        for (let i = 1; i <= max; i++) {
          this.reallyGetIosReviews(app.id, i, max);
        }
      },
      (error) => {
        this.ios.getAppReviews(app.id, 1).subscribe((response: any) => {
          const max = this.getMaxPages(JSON.parse(response.result).feed.link);
          for (let i = 1; i <= max; i++) {
            this.reallyGetIosReviews(app.id, i, max);
          }
        });
      }
    );
  }

  getMaxPages(links: any[]) {
    let maxPage = 0;
    links.forEach((link: any) => {
      if (link.attributes.rel == 'last') {
        const lk = link.attributes.href;
        const page = lk
          .toString()
          .substring(
            lk.toString().indexOf('page=') + 5,
            lk.toString().indexOf('/', lk.toString().indexOf('page=') + 5)
          );
        maxPage = page;
      }
    });
    return maxPage;
  }

  reallyGetIosReviews(id: any, page: number, max: number) {
    this.ios.getAppReviews(id, page).subscribe((response: any) => {
      let resp = JSON.parse(response.result)?.feed?.entry;
      if(resp.length > 0) {
        resp.forEach((el: any) => {
          this.reviews.push(el);
        });
      }
      if (page == max) {
        setTimeout(() => {
          this.getKeywordData(this.reviews, true);
        }, 200);
      }
    });
  }

  getAndroidReviews(app: any) {
    this.android.getAppReviews(app.appId, true).subscribe(
      (response: any) => {
        const resp = JSON.parse(response.result).data;
        resp.forEach((review: any) => {
          this.reviews.push(review.text);
        });
        this.getKeywordData(this.reviews, false);
      },
      (error) => {
        this.android.getAppReviews(app.id).subscribe((response: any) => {
          const resp = JSON.parse(response.result).data;
          resp.forEach((review: any) => {
            this.reviews.push(review.text);
          });
          this.getKeywordData(this.reviews, false);
        });
      }
    );
  }


  getKeywordData(dataForExtraction: any[], isIos: boolean) {
    this.array = [];
    dataForExtraction.forEach((ent: any) => {
      if (isIos) {
        this.array.push(ent?.content?.label);
      } else {
        this.array.push(ent);
      }
    });

    let contentString = this.array.join(' ');

    let extract = keyword_extractor.default.extract(contentString, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
      return_max_ngrams: 1,
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
        z[i].number = z[i].number + 1;
      } else if (
        el !== 'app' &&
        el != 'apps' &&
        el != this.selectedApp.app.title.toLowerCase()
      ) {
        z.push({ text: el, number: 1 });
      }
    });

    if (z.length > 150) {
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
    let multlipicant = 1024 / (length * 9);
    multlipicant = multlipicant > 0.5 ? multlipicant : 1 - multlipicant;
    multlipicant = multlipicant < 20 ? multlipicant : 20;
    multlipicant = multlipicant + this.multiplicant;
    this.multiplicant = multlipicant;
    this.generateWordCloud(z, multlipicant);
  }

  generateWordCloud(data: any[], multlipicant: number) {
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
              data: data.map((d) => d.number * multlipicant),
            },
          ],
        },
      };
      const canvas = <HTMLCanvasElement>document.getElementById('canvas');
      const ctx = canvas?.getContext('2d') || 'canvas';
      this.chart = new Chart('canvas', {
        type: WordCloudController.id,
        data: config.data,
        options: {
          plugins: {
            legend: {
              display: true,
            },
          },
          datasets: {
            wordCloud: {
              rotate: 0,
              padding: 1,
              fit: true,
              rotationSteps: 0,
              color: '#7180AC',
              showTooltips: true,
            },
          },
        },
      });
      this.loading = false;
      console.log(this.chart)
    }, 150);
  }

  redraw() {
    this.chart?.destroy();
    setTimeout(() => {
      this.appSelected(this.selectedApp, true, false);
    }, 200);
  }

  zoom() {
    this.multiplicant = this.multiplicant + (0.1 * this.multiplicant);
    this.redraw();
  }

  zoomMinus() {
    this.multiplicant = this.multiplicant - (0.1 * this.multiplicant);
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
    link.download = this.selectedApp.app.title + '_word_cloud.png';

    link.click();
  }
}
