import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    routeChange = new Subject();
    constructor() {

    }

    ngOnInit() {

    }

    onTabChange() {
        this.routeChange.next();
    }
}
