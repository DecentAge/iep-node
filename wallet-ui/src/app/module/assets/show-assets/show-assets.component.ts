import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-all-assets',
  templateUrl: './show-assets.component.html',
  styleUrls: ['./show-assets.component.scss']
})
export class ShowAssetsComponent implements OnInit {
    routeChange = new Subject();
    constructor(private router: Router){
    }
    ngOnInit(){
    }
    onTabChange() {
        this.routeChange.next();
    }
}
