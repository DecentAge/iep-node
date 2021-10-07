import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-open-offers',
  templateUrl: './my-open-offers.component.html',
  styleUrls: ['./my-open-offers.component.scss']
})
export class MyOpenOffersComponent implements OnInit {

    routeChange = new Subject();
    constructor(private router: Router){
    }
    ngOnInit(){
    }
    onTabChange() {
        this.routeChange.next();
    }

}
