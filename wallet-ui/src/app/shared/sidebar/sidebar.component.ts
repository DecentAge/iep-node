import {Component, OnInit} from '@angular/core';
import {ROUTES} from './sidebar-routes.config';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {LoginService} from '../../services/login.service';
import {RootScope} from '../../config/root-scope';

declare var $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public isExpertWallet: boolean;
    idArray = [];
    balanceTQT: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                public translate: TranslateService,
                public loginService: LoginService
    ) {
        this.balanceTQT = 0;
    }

    ngOnInit() {
        $.getScript('./assets/js/app-sidebar.js');
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.isExpertWallet = this.loginService.isExpertWallet;

        RootScope.onChange.subscribe(data => {
            this.balanceTQT = data['balanceTQT'];
        })
    }

    switchWallet() {
        this.idArray = [];
        this.idArray = $('.sidebar-content li.open').map(function () {
            return this.id;
        }).get();

        this.loginService.isExpertWallet = !this.isExpertWallet;
        this.loginService.applyChanges();
    }

    triggerClick() {
        $("ui-switch").trigger('click');
    }

    //NGX Wizard - skip url change
    ngxWizardFunction(path: string) {
        if (path.indexOf('forms/ngx') !== -1)
            this.router.navigate(['forms/ngx/wizard'], {skipLocationChange: false});
    }
}
