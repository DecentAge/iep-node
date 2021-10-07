import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../../services/crypto.service';
import { CommonService } from '../../../services/common.service';
import { Location } from '@angular/common';
import { SessionStorageService } from '../../../services/session-storage.service';
import { AmountToQuantPipe } from '../../../pipes/amount-to-quant.pipe';

@Component({
    selector: 'app-send-assets',
    templateUrl: './send-assets.component.html',
    styleUrls: ['./send-assets.component.scss']
})
export class SendAssetsComponent implements OnInit {
    openBookMarks: boolean = false;

    constructor(private commonService: CommonService,
        private route: ActivatedRoute,
        private router: Router,
        private sessionStorageService: SessionStorageService,
        private cryptoService: CryptoService,
        public amountToQuant: AmountToQuantPipe,
        private _location: Location) {
    }

    ngOnInit() {
    }

    goBack() {
        this._location.back();
    }

}
