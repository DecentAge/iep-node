import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataStoreService} from '../../../services/data-store.service';
import {Location} from '@angular/common';
import {SearchService} from '../search.service';

@Component({
    selector: 'app-transaction-detail',
    templateUrl: './transaction-detail.component.html',
    styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {

    transaction: any = {};
    view: string;

    constructor(
        private route: ActivatedRoute,
        public searchService: SearchService,
        private _location: Location
    ) { }


    ngOnInit() {
        const sharedData = DataStoreService.get('transaction-details');

        if (!this.transaction) {
            this._location.back();
        }

        this.view = sharedData.view;

        if (sharedData.type && sharedData.type !== 'onlyID') {
            this.transaction = DataStoreService.get('transaction-details');
        } else {
            switch (sharedData.view) {
                case 'transactionDetail':
                    this.searchService.searchTransactionById(sharedData.id).subscribe((success) => {
                        this.transaction = success;
                    });
                    break;
                case 'blockDetail':
                    this.searchService.searchBlocks(sharedData.id).subscribe((success) => {
                        this.transaction = success;
                    });
                    break;
            }
            // TODO: implement logic for function named $scope.searchValue in search module
            // Observable.forkJoin(
            //     this.searchService.searchBlocks(sharedData.id),
            //     this.searchService.searchBlockById(sharedData.id),
            //     this.searchService.searchTransactionById(sharedData.id),
            //     (data1, data2, data3) => ({data1, data2,data3})
            // ).subscribe(data => {
            //   console.log(data)
            // });
        }
    }

    goBack() {
        this._location.back();
    }
}
