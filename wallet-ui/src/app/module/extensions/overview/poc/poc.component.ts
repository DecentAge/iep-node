import { Component, OnInit } from '@angular/core';
import { Extensions } from "../overview.config";

@Component({
    selector: 'app-poc',
    templateUrl: './poc.component.html',
    styleUrls: ['./poc.component.scss']
})
export class PocComponent implements OnInit {
    extentionsInProofOfConcept: any[] = [];

    constructor() {

    }

    ngOnInit() {
        this.extentionsInProofOfConcept = Extensions.extentionsInProofOfConcept;
    }

}
