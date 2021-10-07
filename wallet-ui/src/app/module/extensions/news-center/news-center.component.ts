import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Page } from "../../../config/page";
import { ExtensionsService } from "../extensions.service";
import { NewsCenterService } from "./news-center.service";

@Component({
    selector: 'app-news-center',
    templateUrl: './news-center.component.html',
    styleUrls: ['./news-center.component.scss']
})
export class NewsCenterComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();

    constructor(public router: Router,
                public extensionsService: ExtensionsService,
                public newsCenterService: NewsCenterService) {
        this.setPage({ offset: 0 });
    }

    ngOnInit() {

    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.extensionsService.getNews(
            this.page.pageNumber + 1,
            this.page.size
        ).subscribe((success: any) => {
            this.rows = success;
        });
    }

    reload() {
        this.setPage({ offset: 0 });
    }

    openReadNews(row) {
        this.newsCenterService.setNews(row.news);

        switch (row.action) {
            case 'readNews':
                this.router.navigate(['/tools/newsviewer/read-news']);
                break;
        }
    }
}
