import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AssetsService} from '../../../assets.service';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit {

  assetId: any = '';
  assetDetails: any = {};

  constructor(public assetsService: AssetsService,
              public activatedRoute: ActivatedRoute,
              private _location: Location) { }

  ngOnInit() {
      this.activatedRoute.queryParams.subscribe( (params: any) => {
          this.assetId = params.id;
          this.getAssetInfo();
      });
  }
    getAssetInfo() {
        this.assetsService.getAsset(this.assetId, true).subscribe((response: any) =>  {
            if (!response.errorCode) {
                this.assetDetails = response;
            } else {
                // errorHandler(searchTerm + ' account doesn\'t exists ');
            }
        });
    }
    goBack(){
        this._location.back();
    }

}
