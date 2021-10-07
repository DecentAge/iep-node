import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
@Component({
    selector: 'app-show-ats',
    templateUrl: './show-ats.component.html',
    styleUrls: ['./show-ats.component.scss']
})
export class ShowAtsComponent implements OnInit {
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
