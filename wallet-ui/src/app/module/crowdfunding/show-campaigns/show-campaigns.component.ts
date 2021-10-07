import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
@Component({
    selector: 'app-show-campaigns',
    templateUrl: './show-campaigns.component.html',
    styleUrls: ['./show-campaigns.component.scss']
})
export class ShowCampaignsComponent implements OnInit {
    routeChange = new Subject();
    constructor(private router: Router) {
    }
    ngOnInit() {
    }
    onTabChange() {
        this.routeChange.next();
    }

    navigateTo(url) {
        this.router.navigateByUrl(url);
    }
}
