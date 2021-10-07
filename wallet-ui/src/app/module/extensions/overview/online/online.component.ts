import { Component, OnInit } from '@angular/core';
import { Extensions } from "../overview.config";

@Component({
    selector: 'app-online',
    templateUrl: './online.component.html',
    styleUrls: ['./online.component.scss']
})
export class OnlineComponent implements OnInit {
    extensionsOnline: any[] = [];
    constructor() {
    }

    ngOnInit() {
        this.extensionsOnline = Extensions.extensionsOnline;
    }

}
