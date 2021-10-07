import { Component, OnInit } from '@angular/core';
import { Extensions } from "../overview.config";

@Component({
    selector: 'app-all',
    templateUrl: './all.component.html',
    styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {
    extensionsOnline: any[] = [];
    extensionsInDevelopment: any[] = [];
    extensionsInConcept: any[] = [];
    extentionsInProofOfConcept: any[] = [];

    constructor() {
    }

    ngOnInit() {
        this.extensionsOnline = Extensions.extensionsOnline;
        this.extensionsInDevelopment = Extensions.extensionsInDevelopment;
        this.extensionsInConcept = Extensions.extensionsInConcept;
        this.extentionsInProofOfConcept = Extensions.extentionsInProofOfConcept;
    }

}
