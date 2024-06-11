import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PointStyle } from 'chart.js';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  @Input() versions: any[] = [];
  @Input() years: any[] = [];
  @Input() versionSorted: any = { sorted: false, type: 'A' };
  @Input() dateSorted: any = { sorted: true, type: 'D' };
  @Input() ratingSorted: any = { sorted: false, type: 'A' };
  @Input() title: string = "";
  @Input() logo: string = "";
  @Input() isIOS: boolean = false;

  @Output() searchKeyword: EventEmitter<string> = new EventEmitter<string>();
  @Output() version: EventEmitter<string> = new EventEmitter<string>();
  @Output() year: EventEmitter<string> = new EventEmitter<string>();
  @Output() ratingFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() sortBy: EventEmitter<string> = new EventEmitter<string>();
  @Output() viewStyle: EventEmitter<string> = new EventEmitter<string>();

  public showFilters: boolean = screen.width > 500 ? true : false;
  public showFilterButton: boolean = screen.width < 500 ? true : false;
  public sortingArray: any[] = [
    { value: 'date', text: 'Date' },
    { value: 'rating', text: 'Rating' },
    { value: 'version', text: 'Version' },
  ];

  public ratings: any[] = [
    { text: '1★', value: '1', isSelected: false },
    { text: '2★', value: '2', isSelected: false },
    { text: '3★', value: '3', isSelected: false },
    { text: '4★', value: '4', isSelected: false },
    { text: '5★', value: '5', isSelected: false },
  ];

  // Filters

  public expandVersion: boolean = false;
  public expandYear: boolean = false;
  public expandSort: boolean = false;
  displayStyle: string = "grid";

  // Selected Values

  public selectedVersion: boolean = false;
  public selectedYear: boolean = false;
  public selectedSort: boolean = false;
  public versionValue: any; 
  public yearValue: any; 
  public sortValue: any; 

  constructor() { }

  ngOnInit(): void { 
    this.versionSelected(-1);
    this.yearSelected(-1);
    this.sortChange("date");
  }

  searchInput(event: any) {
    event.preventDefault();
    this.searchKeyword.emit(event.target.value);
  }

  toggleRatingSelection(rate: any) {
    this.ratings.find((rating) => {
      return rating.text == rate.text;
    }).isSelected = !this.ratings.find((rating) => {
      return rating.text == rate.text;
    }).isSelected;

    let areAnySelected = false;
    this.ratings.forEach((rating: any) => {
      if (rating.isSelected) {
        areAnySelected = true;
      }
    });

    let ratings = [];
    if (!areAnySelected) {
      ratings = JSON.parse(JSON.stringify(this.ratings));
      ratings.forEach((rating: any) => {
        rating.isSelected = true;
      });
      this.ratingFilter.emit(ratings);
    } else {
      this.ratingFilter.emit(this.ratings);
    }
  }

  versionSelected(event: any) {
    this.selectedVersion = true;
    this.versionValue = event == -1 ? 'All' : event;
    this.expandVersion = false;
    this.version.emit(event);
  }

  yearSelected(event: any) {
    this.selectedYear = true;
    this.yearValue = event == -1 ? 'All' : event;
    this.expandYear = false;
    this.year.emit(event);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  sortChange(event: any) {
    this.selectedSort = true;
    this.sortValue = event;
    this.expandSort = false;
    this.sortBy.emit(event);
  }

  sortByEmit(str: string) {
    this.sortBy.emit(str);
  }

  toggler(type: string) {
    switch (type) {
      case "version": this.expandVersion = !this.expandVersion; break;
      case "year": this.expandYear = !this.expandYear; break;
      case "sort": this.expandSort = !this.expandSort; break;

      default:
        break;
    }
  }

  changeViewPattern(style: string) {
    this.displayStyle = style;
    this.viewStyle.emit(style);
  }

  getArrow(): string {
    let r: string = "up";
    if(this.versionSorted.sorted) {
      r = this.versionSorted.type == "A" ? 'up': 'down';
    } else if (this.ratingSorted.sorted) {
      r = this.ratingSorted.type == "A" ? 'up': 'down';
    } else if (this.dateSorted.sorted) {
      r = this.dateSorted.type == "A" ? 'up': 'down';
    }
    return r;
  }

}
