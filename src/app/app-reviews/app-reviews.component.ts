import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AndroidService } from '../services/android.service';
import { DataService } from '../services/data.service';
import { IosService } from '../services/ios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-reviews',
  templateUrl: './app-reviews.component.html',
  styleUrls: ['./app-reviews.component.css']
})
export class AppReviewsComponent implements AfterViewInit {
  public appData: any[] = [];
  public platform: boolean = false;
  public versions: any[] = [];
  public years: any[] = [];
  public title: string = "";
  public logo: string = "";
  public isIOS: boolean = false;
  private currentApp: any;
  private backup: any[] = [];
  private isFilterApplied: number = 0;
  
  public versionSorted: any = { sorted: false, type: 'A' };
  public dateSorted: any = { sorted: false, type: 'A' };
  public ratingSorted: any = { sorted: false, type: 'A' };
  private sortingCriteria: any = {};

  constructor(public data: DataService, private android: AndroidService, private ios: IosService, private router: Router) { }

  ngAfterViewInit(): void {
    this.data.isLoading = true;
    let resp = this.data.getCurrentApp();
    // this.data.appLoader.subscribe((resp: any) => {
    if (!!resp) {
      this.title = resp.app.title;
      this.logo = resp.app.icon;
      this.isIOS = resp.isIOS;
      if (resp.isIOS) {
        this.platform = true;
        this.getIOSReviews(resp);
        this.currentApp = resp.app;
      } else {
        this.platform = false;
        this.android.getAppReviews(resp.app.appId).subscribe((data: any) => {
          this.appData = JSON.parse(data.result).data;
          this.backup = JSON.parse(JSON.stringify(this.appData));
          this.appData.forEach((entry: any) => {
            this.versions = this.data.addIfNotPresent(entry.version, this.versions);
            this.years = this.data.addIfNotPresent(new Date(entry.date).getFullYear(), this.years);
          });
          this.versions = this.data.sortDescending(this.versions);
          this.years = this.data.sortDescending(this.years);
          this.data.isLoading = false;
        })
      }
    } else {
      this.router.navigate(["/apps"]);
    }
    // })
  }

  getIOSReviews(resp: any) {
    this.ios.getAppReviews(resp.app.id, 1).subscribe((response: any) => {
      let reviews = JSON.parse(response.result);
      this.appData = [];
      this.getMaxPageNumber(reviews.feed.link).then((lastPageNumber: number) => {
        this.getSequentialReviews(lastPageNumber, 1);
      });
    })
  }

  getMaxPageNumber(links: any[]): Promise<number> {
    return new Promise((resolve) => {
      let lastPage = links.filter((link: any) => { return link.attributes.rel == "last" })[0].attributes.href.toString();
      let lastPageNumber = parseInt(lastPage.substring(lastPage.indexOf("page=") + 5, lastPage.indexOf("/", lastPage.indexOf("page=") + 5)));
      resolve(lastPageNumber);
    });
  }

  getSequentialReviews(total: number, index: number) {
    if (index <= total) {
      this.getSinglePageReviews(index).then((reviews: any) => {
        if(reviews?.length > 0) {
          reviews.forEach(el => {
            this.appData.push(el);
          });
          this.data.isLoading = false;
        }
        if (index == total) {
          this.backup = JSON.parse(JSON.stringify(this.appData));
          this.appData.forEach((entry: any)=> {
            this.versions = this.data.addIfNotPresent(entry["im:version"].label, this.versions);
            this.years = this.data.addIfNotPresent(new Date(entry["updated"].label).getFullYear(), this.years);
          })
        }
        index = index + 1;
        this.getSequentialReviews(total, index);
      })
    } else {

    }
  }

  getSinglePageReviews(index: number): Promise<any> {
    return new Promise((resolve) => {
      this.ios.getAppReviews(this.currentApp.id, index).subscribe((reviews: any) => {
        resolve(JSON.parse(reviews.result)?.feed?.entry);
      })
    })
  }

  versionFilter(version: any) {
    if (this.platform) {
      if (version == -1) {
        this.sortingCriteria['version'] = null;
        this.filterData(true);
      } else {
        this.sortingCriteria['version'] = version;
        this.filterData(true);
      }
    } else {
      if (version == -1) {
        this.sortingCriteria['version'] = null;
        this.filterData(false);
      } else {
        this.sortingCriteria['version'] = version;
        this.filterData(false);
      }
    }
  }

  yearFilter(year: any) {
    if (this.platform) {
      if (year == -1) {
        this.sortingCriteria['year'] = null;
        this.filterData(true);
      } else {
        this.sortingCriteria['year'] = year;
        this.filterData(true);
      }
    } else {
      if (year == -1) {
        this.sortingCriteria['year'] = null;
        this.filterData(false);
      } else {
        this.sortingCriteria['year'] = year;
        this.filterData(false);
      }
    }
  }

  searchSort(keyword: any) {
    if (this.platform) {
      this.sortingCriteria['search'] = keyword;
      this.filterData(true);
    } else {
      this.sortingCriteria['search'] = keyword;
      this.filterData(false);
    }
  }

  ratingFilter(ratingArray: any) {
    let app = '';

    this.sortingCriteria['rating'] = ratingArray;

    this.backup.forEach((el: any) => {
      if (!!el?.score) {
        app = 'android';
      } else if (!!el['im:rating']?.label) {
        app = 'ios';
      }
    });

    if (app == 'android') {
      this.filterData(false);
    } else {
      this.filterData(true);
    }
    // length = this.appData.length + this.appData.length;
    // this.sortSnackbar(length + ' matching reviews');
  }

  filterData(isIOS: boolean) {
    if (isIOS) {
      this.appData = this.backup;
      let rating = !!this.sortingCriteria.rating;
      let year = !!this.sortingCriteria.year;
      let version = !!this.sortingCriteria.version;
      let search = !!this.sortingCriteria.search;

      let switcher = '';

      let filterRating: any[] = [];
      if (!!rating) {
        this.sortingCriteria.rating.forEach((rating: any) => {
          if (rating.isSelected) {
            filterRating.push(rating.value);
          }
        });
      }

      if (!version && !search && year) {
        switcher = 'year';
      } else if (version && !search && !year) {
        switcher = 'version';
      } else if (!version && search && !year) {
        switcher = 'search';
      } else if (version && !search && year) {
        switcher = 'year-version';
      } else if (!version && search && year) {
        switcher = 'year-search';
      } else if (version && search && !year) {
        switcher = 'version-search';
      } else if (version && search && year) {
        switcher = 'all';
      }

      switch (switcher) {
        case 'year':
          this.appData = this.backup.filter((el: any) => {
            return (
              new Date(el.updated.label).getFullYear() ==
              this.sortingCriteria.year
            );
          });
          break;
        case 'version':
          this.appData = this.backup.filter((el: any) => {
            return el['im:version'].label == this.sortingCriteria.version;
          });
          break;
        case 'search':
          this.appData = this.backup.filter((el: any) => {
            return (
              el.content.label
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()) ||
              el.title.label.toLowerCase().includes(this.sortingCriteria.search.toLowerCase())
            );
          });
          this.highlight('');
          break;
        case 'year-version':
          this.appData = this.backup.filter((el: any) => {
            return (
              new Date(el.updated.label).getFullYear() ==
              this.sortingCriteria.year &&
              el['im:version'].label == this.sortingCriteria.version
            );
          });
          break;
        case 'year-search':
          this.appData = this.backup.filter((el: any) => {
            return (
              new Date(el.updated.label).getFullYear() ==
              this.sortingCriteria.year &&
              (el.content.label
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()) ||
                el.title.label.toLowerCase().includes(this.sortingCriteria.search.toLowerCase()))
            );
          });
          this.highlight('');
          break;
        case 'version-search':
          this.appData = this.backup.filter((el: any) => {
            return (
              el['im:version'].label == this.sortingCriteria.version &&
              (el.content.label
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()) ||
                el.title.label.toLowerCase().includes(this.sortingCriteria.search.toLowerCase()))
            );
          });
          this.highlight('');
          break;
        case 'all':
          this.appData = this.backup.filter((el: any) => {
            return (
              el['im:version'].label == this.sortingCriteria.version &&
              (el.content.label
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()) ||
                el.title.label.toLowerCase().includes(this.sortingCriteria.search.toLowerCase())) &&
              new Date(el.updated.label).getFullYear() ==
              this.sortingCriteria.year
            );
          });
          this.highlight('');
          break;
        default:
          break;
      }

      if (filterRating.length > 0) {
        let temp: any[] = [];
        this.appData.forEach((el: any) => {
          filterRating.forEach((rating: any) => {
            if (el['im:rating'].label == rating) {
              temp.push(el);
            }
          });
        });
        this.appData = temp;
      }

    } else {
      this.appData = this.backup;
      let rating = !!this.sortingCriteria.rating;
      let year = !!this.sortingCriteria.year;
      let version = !!this.sortingCriteria.version;
      let search = !!this.sortingCriteria.search;

      let switcher = '';

      let filterRating: any[] = [];
      if (!!rating) {
        this.sortingCriteria.rating.forEach((rating: any) => {
          if (rating.isSelected) {
            filterRating.push(rating.value);
          }
        });
      }

      if (!version && !search && year) {
        switcher = 'year';
      } else if (version && !search && !year) {
        switcher = 'version';
      } else if (!version && search && !year) {
        switcher = 'search';
      } else if (version && !search && year) {
        switcher = 'year-version';
      } else if (!version && search && year) {
        switcher = 'year-search';
      } else if (version && search && !year) {
        switcher = 'version-search';
      } else if (version && search && year) {
        switcher = 'all';
      }

      switch (switcher) {
        case 'year':
          this.appData = this.backup.filter((el: any) => {
            return new Date(el.date).getFullYear() == this.sortingCriteria.year;
          });
          break;
        case 'version':
          this.appData = this.backup.filter((el: any) => {
            return el.version == this.sortingCriteria.version;
          });
          break;
        case 'search':
          this.appData = this.backup.filter((el: any) => {
            return el.text
              .toLowerCase()
              .includes(this.sortingCriteria.search.toLowerCase());
          });
          this.highlight('');
          break;
        case 'year-version':
          this.appData = this.backup.filter((el: any) => {
            return (
              new Date(el.date).getFullYear() == this.sortingCriteria.year &&
              el.version == this.sortingCriteria.version
            );
          });
          break;
        case 'year-search':
          this.appData = this.backup.filter((el: any) => {
            return (
              new Date(el.date).getFullYear() == this.sortingCriteria.year &&
              el.text
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase())
            );
          });
          this.highlight('');
          break;
        case 'version-search':
          this.appData = this.backup.filter((el: any) => {
            return (
              el.version == this.sortingCriteria.version &&
              el.text
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase())
            );
          });
          this.highlight('');
          break;
        case 'all':
          this.appData = this.backup.filter((el: any) => {
            return (
              el.version == this.sortingCriteria.version &&
              el.text
                .toLowerCase()
                .includes(this.sortingCriteria.search.toLowerCase()) &&
              new Date(el.date).getFullYear() == this.sortingCriteria.year
            );
          });
          this.highlight('');
          break;
        default:
          break;
      }

      if (filterRating.length > 0) {
        let temp: any[] = [];
        this.appData.forEach((el: any) => {
          filterRating.forEach((rating: any) => {
            if (el.score == rating) {
              temp.push(el);
            }
          });
        });
        this.appData = temp;
      }
    }
  }

  highlight(keyword: string) {
    setTimeout(() => {
      let titles = Array.from(<HTMLCollection>document.getElementsByClassName('title'));
      let content = Array.from(<HTMLCollection>document.getElementsByClassName('content'));
      const regex = new RegExp(this.sortingCriteria.search.toLowerCase(), 'gi');

      content.forEach(cont => {
        let text = cont.innerHTML;
        text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');
        let newText = text.replace(
          regex,
          '<mark class="highlight">$&</mark>'
        );
        cont.innerHTML = newText;
      });

      titles.forEach(title => {
        let text = title.innerHTML;
        text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');
        let newText = text.replace(
          regex,
          '<mark class="highlight">$&</mark>'
        );
        title.innerHTML = newText;
      })

    }, 300);
  }

  sortFilter(event: any) {

  }
}
