import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-show-currencies',
    templateUrl: './show-currencies.component.html',
    styleUrls: ['./show-currencies.component.scss']
})
export class ShowCurrenciesComponent implements OnInit {
    routeChange = new Subject();
    constructor(private router: Router) {
    }
    ngOnInit() {
    }
    onTabChange() {
        this.routeChange.next();
    }
}
