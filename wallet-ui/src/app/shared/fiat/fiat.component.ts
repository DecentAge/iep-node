
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { FiatService } from "../../services/fiat.service";

import { QuantToAmountPipe } from "../../pipes/quant-to-amount.pipe";

@Component({
    selector: 'app-fiat',
    templateUrl: './fiat.component.html',
    styleUrls: ['./fiat.component.scss']
})
export class FiatComponent implements OnChanges {
    @Input() amountTqt: string;
    @Input() amount: string;
    xinUSDBTC = 0;
    xinPriceUSD = 0;
    xinPriceBTC = 0;
    xinVolume24 = 0;
    xinChange24 = 0;
    finalAmount = 0;
    constructor(public fiatService: FiatService,
        public quantToAmount: QuantToAmountPipe) {
        //console.log(this.amountTqt);
    }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes['amount'] && changes['amount'].previousValue !== changes['amount'].currentValue) {
            // console.log("amount")
            // console.log(changes['amount'].currentValue)
            this.getXinPrice(changes['amount'].currentValue);
        }
        if (changes['amountTqt'] && changes['amountTqt'].previousValue !== changes['amountTqt'].currentValue) {
            // console.log("amountTqt")
            // console.log(changes['amountTqt'].currentValue)
            const finalAmount = this.quantToAmount.transform(changes['amountTqt'].currentValue);
            this.getXinPrice(finalAmount);
        }
    }

    getXinPrice(finalAmount_) {
        // const btcPricePromise = this.fiatService.getBtcPrice();
        const xinPricePromise = this.fiatService.getXinPrice();

        observableForkJoin([xinPricePromise])
            .subscribe((success) => {
                // const btcPriceJson: any = success[0];
                const xinPriceJson: any = success[0];

                // this.xinUSDBTC = btcPriceJson.averages.day || 0;
                this.xinPriceUSD = xinPriceJson[0].price_usd || 0;

                this.xinPriceBTC = xinPriceJson[0].price_btc || 0;
                this.xinVolume24 = xinPriceJson[0]['24h_volume_usd'] || 0;
                this.xinChange24 = xinPriceJson[0].percent_change_24h || 0;

                this.finalAmount = finalAmount_ * xinPriceJson[0].price_usd;
            });
    }
}
