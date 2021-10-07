import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
    routeChange = new Subject();
    constructor(private router: Router) {
    }
  ngOnInit() {
  }
    /*navigateTo(route) {
        this.router.navigate([route]);
    }*/
    onTabChange() {
        this.routeChange.next();
    }
}
