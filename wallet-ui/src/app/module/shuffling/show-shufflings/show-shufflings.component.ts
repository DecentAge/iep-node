import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
@Component({
    selector: 'app-show-shufflings',
    templateUrl: './show-shufflings.component.html',
    styleUrls: ['./show-shufflings.component.scss']
})
export class ShowShufflingsComponent implements OnInit {
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
