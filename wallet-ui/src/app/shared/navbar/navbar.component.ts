import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../shared/auth/auth.service";
import * as alertFunctions from "../../shared/data/sweet-alerts";
import { OptionService } from "../../services/option.service";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { AccountService } from "../../module/account/account.service";
import { SubscriptionService } from "../../module/subscriptions/subscription.service";
import { EscrowService } from "../../module/escrow/escrow.service";
import { CommonService } from "../../services/common.service";
import { ExtensionsService } from "../../module/extensions/extensions.service";
import { AddressService } from "../../module/account/address.service";
import { SwappService } from "../../services/swapp.service";
import { text } from "@angular/core/src/render3/instructions";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
    currentLang = "en";
    toggleClass = "ft-maximize";
    connectionMode: string;
    approvals: any = 0;
    escrows: any = 0;
    subscriptions: any = 0;
    news_content: any = [];

    public isExpertWallet: boolean;

    constructor(
        public translate: TranslateService,
        public authService: AuthService,
        public optionService: OptionService,
        public router: Router,
        public loginService: LoginService,
        private accountService: AccountService,
        private commonsService: CommonService,
        private extensionsService: ExtensionsService,
        private escrowService: EscrowService,
        private subscriptionService: SubscriptionService,
        public addressService: AddressService,
        public swappService: SwappService
    ) {
        //const browserLang: string = translate.getBrowserLang();
        //translate.use(browserLang.match(/en|es|pt|de/) ? browserLang : 'en');

        this.optionService.optionsChanged$.subscribe(res => {
            this.ngOnInit();
        });
    }

    ngOnInit() {
        this.isExpertWallet = this.loginService.isExpertWallet;
        this.getBadges();
        // this.getLatestNews();
    }

    getBadges() {
        let accountRs = this.commonsService.getAccountDetailsFromSession(
            "accountRs"
        );
        this.accountService.getVoterPhasedTransactions(accountRs, "", "").subscribe(
            success => {
                let approvals = success["transactions"];
                this.approvals = approvals ? approvals.length : 0;
            },
            error => {
                this.approvals = 0;
            }
        );

        this.escrowService
            .getAccountEscrowTransactions(accountRs, "", "")
            .subscribe(
                success => {
                    let escrow = success["escrows"];
                    this.escrows = escrow ? escrow.length : 0;
                },
                error => {
                    this.escrows = 0;
                }
            );

        this.subscriptionService
            .getAccountSubscriptions(accountRs, "", "")
            .subscribe(
                success => {
                    let subscription = success["subscriptions"];
                    this.subscriptions = subscription ? subscription.length : 0;
                },
                function (error) {
                    this.subscriptions = 0;
                }
            );
    }
    getLatestNews() {
        this.extensionsService.getNews().subscribe(
            success => {
                this.news_content = success;
            },
            error => { }
        );
    }

    ChangeLanguage(language: string) {
        this.translate.use(language);
    }

    ToggleClass() {
        if (this.toggleClass === "ft-maximize") {
            this.toggleClass = "ft-minimize";
        } else this.toggleClass = "ft-maximize";
    }

    acconutControl() {
        this.router.navigate(["account/control"]);
    }

    myEscrow() {
        this.router.navigate(["escrow/my-escrow"]);
    }

    mySubscription() {
        this.router.navigate(["subscriptions/my-subscriptions"]);
    }

    newFoundation() {
        this.router.navigate(["extensions/newsviewer"]);
    }

    sendToken() {
        this.router.navigate(["account/send"]);
    }

    sendMessage() {
        this.router.navigate(["messages/send-message"]);
    }

    sendAssets() {
        this.router.navigate(["assets/send-assets"]);
    }

    sendCurrency() {
        this.router.navigate(["currencies/send-currencies"]);
    }

    openBookMarks() {
        this.router.navigate(["account/bookmark"]);
    }

    logout() {
        let title: string;
        let text: string;
        let inputPlaceholder: string;
        let confirmButtonText: string;
        let cancelButtonText: string;
        this.translate.get("tool-pages.log-out").subscribe((res: any) => {
            title = res.title;
            text = res.text;
            inputPlaceholder = res.inputPlaceholder;
            confirmButtonText = res.confirmButtonText;
            cancelButtonText = res.cancelButtonText;
        });
        alertFunctions
            .confirmLogoutButton(
                title,
                text,
                inputPlaceholder,
                confirmButtonText,
                cancelButtonText
            )
            .then(
                result => {
                    if (result.value === 0 || result.value === 1) {
                        if (result.value === 1) {
                            //clear localstorage
                            const publicKey = this.commonsService.getAccountDetailsFromSession('publicKey');
                            this.swappService.clearSwapps();
                            this.optionService.clearOptions(
                                publicKey,
                                success => { },
                                error => { }
                            );
                            this.addressService.clearContacts(
                                publicKey,
                                success => { },
                                error => { }
                            );
                        }
                        setTimeout(() => {
                            this.authService.logout();
                        }, 500);
                    }
                },
                () => { }
            );
    }
}
