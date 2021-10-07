import { Component, OnInit } from '@angular/core';
import { Page } from "../../../config/page";
import { ExtensionsService } from "../extensions.service";

@Component({
    selector: 'app-macap',
    templateUrl: './macap.component.html',
    styleUrls: ['./macap.component.scss']
})
export class MacapComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();

    constructor(public extensionsService: ExtensionsService) {
        this.setPage({ offset: 0 });
    }

    ngOnInit() {
        this.page.totalElements = 2244;
        this.page.totalPages = 225;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.extensionsService.getMaCap(
            this.page.pageNumber + 1,
            this.page.size
        ).subscribe((success: any) => {
            this.rows = success;
        });
    }

    reload() {
        this.setPage({ offset: 0 });
    }

}
