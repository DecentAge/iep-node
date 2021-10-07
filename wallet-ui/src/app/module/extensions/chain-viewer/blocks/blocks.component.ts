import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from "../../../../config/page";
import { ExtensionsService } from "../../extensions.service";
import { AppConstants } from "../../../../config/constants";
import { SearchService } from "../../../../shared/search/search.service";

@Component({
    selector: 'app-blocks',
    templateUrl: './blocks.component.html',
    styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();

    constructor(public extensionsService: ExtensionsService, public router: Router, public searchService: SearchService) {
        this.setPage({ offset: 0 });
    }

    ngOnInit() {

    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        let startIndex = this.page.pageNumber * this.page.size,
            endIndex = ((this.page.pageNumber + 1) * this.page.size) - 1;
        this.extensionsService.getBlocks(startIndex, endIndex).subscribe((success: any) => {
            this.rows = success.blocks;
        })
    }

    reload() {
        this.setPage({ offset: 0 });
    }

    searchValue(searchTerm) {
        if (searchTerm) {
            if (searchTerm.toString().startsWith(AppConstants.searchConfig.searchAccountString)) {
                this.router.navigate(['/tools/chain-viewer/account-details'], { queryParams: { id: searchTerm } });
            } else if (!isNaN(searchTerm)) {
                this.router.navigate(['/tools/chain-viewer/block-transaction-details'], { queryParams: { id: searchTerm } });
            }
        }
    }
}
