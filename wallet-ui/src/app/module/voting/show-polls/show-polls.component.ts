import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-show-polls',
    templateUrl: './show-polls.component.html',
    styleUrls: ['./show-polls.component.scss']
})
export class ShowPollsComponent implements OnInit {

    routeChange = new Subject();
    constructor(public router: Router) {
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