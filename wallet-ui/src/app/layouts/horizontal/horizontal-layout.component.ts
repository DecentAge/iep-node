import { Component, OnInit, ElementRef } from '@angular/core';

var fireRefreshEventOnWindow = function () {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);
};

@Component({
    selector: 'app-horizontal-layout',
    templateUrl: './horizontal-layout.component.html',
    styleUrls: ['./horizontal-layout.component.scss']
})

export class HorizontalLayoutComponent implements OnInit {
    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
        //sidebar toggle event listner
        this.elementRef.nativeElement.querySelector('#sidebarToggle')
            .addEventListener('click', this.onClick.bind(this));
        //customizer events
        this.elementRef.nativeElement.querySelector('#cz-compact-menu')
            .addEventListener('click', this.onClick.bind(this));
        this.elementRef.nativeElement.querySelector('#cz-sidebar-width')
            .addEventListener('click', this.onClick.bind(this));
    }

    onClick(event) {
        //initialize window resizer event on sidebar toggle click event
        setTimeout(() => { fireRefreshEventOnWindow() }, 300);
    }

}