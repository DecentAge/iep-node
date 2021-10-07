import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-bookmark-list-only',
  templateUrl: './bookmark-list-only.component.html',
  styleUrls: ['./bookmark-list-only.component.scss']
})
export class BookmarkListOnlyComponent implements OnInit {
  componentName = '';
  constructor(private _location: Location,
              public activatedRoute: ActivatedRoute) {
      this.activatedRoute.queryParams.subscribe((params: any) => {
          if (params.fromView) {
              this.componentName = params.fromView;
          }
      });
  }

  ngOnInit() {
  }
  goBack() {
      this._location.back();
  }
}
