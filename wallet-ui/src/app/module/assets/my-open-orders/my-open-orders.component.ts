import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-my-open-orders',
  templateUrl: './my-open-orders.component.html',
  styleUrls: ['./my-open-orders.component.scss']
})
export class MyOpenOrdersComponent implements OnInit {
    routeChange = new Subject();
    constructor(private router: Router){
    }
    ngOnInit(){
    }
    onTabChange() {
        this.routeChange.next();
    }
}
