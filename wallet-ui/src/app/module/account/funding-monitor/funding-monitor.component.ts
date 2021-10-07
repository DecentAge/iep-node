import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-funding-monitor',
    templateUrl: './funding-monitor.component.html',
    styleUrls: ['./funding-monitor.component.scss']
})
export class FundingMonitorComponent implements OnInit {
    routeChange = new Subject();
    constructor(private router: Router){
    }
    ngOnInit(){
    }
    onTabChange() {
        this.routeChange.next();
    }
}