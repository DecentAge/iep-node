import { Component, OnInit } from '@angular/core';
import {SessionStorageService} from '../../../../services/session-storage.service';
import {CryptoService} from '../../../../services/crypto.service';
import {AccountService} from '../../account.service';


@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {
    receiveAddress: string = '';
    accountRs: string = null;
    mailTo: string = null;
  constructor(public sessionStorageService: SessionStorageService,
              public accountService: AccountService,
              public cryptoService: CryptoService) {
      this.getAccountDetails();
  }

  ngOnInit() {
  }

    getAccountDetails = () => {
        this.receiveAddress = this.accountService.getAccountDetailsFromSession('publicKey');
        this.accountRs = this.accountService.getAccountDetailsFromSession('accountRs');
        this.mailTo = "mailto:?subject=XIN Address&body=My XIN Address is : "+ this.accountRs;
    };

    copyText = (element, tooltip) => {
        element.select();
        tooltip.open();
        document.execCommand('copy');
        setTimeout(() => {
            tooltip.close();
        }, 5000)
    };

    print = () => {
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                    <title>Print tab</title>
                    <style>
                        .text-center {
                            text-align: center;
                        }
                        qrcode {
                            display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
                            display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
                            display: -ms-flexbox;      /* TWEENER - IE 10 */
                            display: -webkit-flex;     /* NEW - Chrome */
                            display: flex;
                            text-align: center;
                            justify-content: center;
                        }
                        input {
                            width: 100%;
                            border: none;
                        }
                    </style>
                </head>
                <body onload="window.print();window.close();">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
    };
}
