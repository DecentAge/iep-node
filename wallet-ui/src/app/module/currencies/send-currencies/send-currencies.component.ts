import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CryptoService } from '../../../services/crypto.service';
import { AmountToQuantPipe } from '../../../pipes/amount-to-quant.pipe';
import { CommonService } from '../../../services/common.service';
import { SessionStorageService } from '../../../services/session-storage.service';

@Component({
    selector: 'app-send-currencies',
    templateUrl: './send-currencies.component.html',
    styleUrls: ['./send-currencies.component.scss']
})
export class SendCurrenciesComponent implements OnInit {
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
