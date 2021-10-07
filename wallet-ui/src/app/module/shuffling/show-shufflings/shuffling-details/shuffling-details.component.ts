import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import { ShufflingService } from '../../shuffling.service';

@Component({
  selector: 'app-shuffling-details',
  templateUrl: './shuffling-details.component.html',
  styleUrls: ['./shuffling-details.component.scss']
})
export class ShufflingDetailsComponent implements OnInit {

  shufflingId:any;
  shuffle:any;

  constructor(public activatedRoute: ActivatedRoute,
              private _location: Location,
              private shufflingService: ShufflingService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe( (params: any) => {
      if (!params.id) {
          this._location.back();
      }
      this.shufflingId = params.id;
      this.getShuffleDetails();
    });
  }

  getShuffleDetails() {
    this.shufflingService.getShuffling(this.shufflingId).subscribe((success) => {
        this.shuffle = success;
    });
  }

  goBack() {
      this._location.back();
  }

}
