import { Injectable } from '@angular/core';

@Injectable()
export class FeeService {

  constructor() { }
    //the provider recipe for services require you specify a $get function
    getCharacterLength = function(val) {
        if (val) {
            return val.length;
        }
        return 0;
    }

    getSetAccountFee = function (name, description?) {
        let totalLength = this.getCharacterLength(name) + this.getCharacterLength(description);
        let totalFee = 1;
        if (totalLength > 0) {
            let normalizedLength = totalLength - 1;
            let total32Blocks = Math.floor(normalizedLength / 32);
            totalFee += 2 * ( total32Blocks - 0);
        }
        return totalFee;

    };

    getIssueAssetFee = function () {
        return 1000;
    };

    getDeleteAssetFee = function () {
        return 1;
    };

    getDeleteCurrencyFee = function () {
        return 1;
    };

    transferAssetFee = function () {
        return 1;
    };

    getTransferCurrencyFee = function () {
        return 1;
    };

    getIssueCurrencyFee = function (currencyCode) {
        let length = this.getCharacterLength(currencyCode);
        switch (length) {
            case 3:
                return 25000;
            case 4:
                return 1000;
            case 5:
                return 40;
        }
        return -1;
    };

    getCreatePollFee = function () {
        return 10;
    };

    getCastVoteFee=function(){
        return 1;
    };

    getSetAliasFee = function () {
        return 2;
    };

    getDeleteAliasFee = function () {
        return 2;
    };

}
