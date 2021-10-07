import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-buy-offers',
    templateUrl: './buy-offers.component.html',
    styleUrls: ['./buy-offers.component.scss']
})
export class BuyOffersComponent implements OnInit {
    routeChange = new Subject();
    constructor(){
    }
    ngOnInit(){
    }
    onTabChange() {
        this.routeChange.next();
    }

}
