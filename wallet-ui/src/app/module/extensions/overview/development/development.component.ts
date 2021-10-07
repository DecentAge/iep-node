import { Component, OnInit } from '@angular/core';
import { Extensions } from "../overview.config";

@Component({
    selector: 'app-development',
    templateUrl: './development.component.html',
    styleUrls: ['./development.component.scss']
})
export class DevelopmentComponent implements OnInit {
    extensionsInDevelopment: any[] = [];

    constructor() {

    }

    ngOnInit() {
        this.extensionsInDevelopment = Extensions.extensionsInDevelopment;
    }

}
