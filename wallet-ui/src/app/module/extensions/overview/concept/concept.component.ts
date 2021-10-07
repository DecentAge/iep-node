import { Component, OnInit } from '@angular/core';
import { Extensions } from '../overview.config';

@Component({
    selector: 'app-concept',
    templateUrl: './concept.component.html',
    styleUrls: ['./concept.component.scss']
})
export class ConceptComponent implements OnInit {
    extensionsInConcept: any[] = [];

    constructor() {

    }

    ngOnInit() {
        this.extensionsInConcept = Extensions.extensionsInConcept;
    }

}
