import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-receive-tab',
    templateUrl: './receive-tab.component.html',
    styleUrls: ['./receive-tab.component.scss']
})
export class ReceiveTabComponent implements OnInit {

    routeChange = new Subject();
    constructor() {
    }

    ngOnInit() {

    }

    onTabChange() {
        this.routeChange.next();
    }
}
