import { Component, OnInit } from '@angular/core';
import { Page } from "../../../../config/page";
import { Router } from "@angular/router";
import { ExtensionsService } from "../../extensions.service";
import { AppConstants } from "../../../../config/constants";
import { SearchService } from "../../../../shared/search/search.service";

@Component({
    selector: 'app-peers',
    templateUrl: './peers.component.html',
    styleUrls: ['./peers.component.scss']
})
export class PeersComponent implements OnInit {
    page = new Page();
    rows = new Array<any>();

    barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                gridLines: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    display: false
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    display: false
                }
            }],
        },
    };
    barChartLabels: any[] = [];
    barChartType = 'bar';
    barChartLegend = false;
    barChartData: any[] = [];
    barChartColors: Array<any> = [];

    constructor(public extensionsService: ExtensionsService, public router: Router, public searchService: SearchService) {

    }

    ngOnInit() {
        this.setPage({ offset: 0 });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.extensionsService.getPeers(this.page.pageNumber + 1, this.page.size).subscribe((success: any) => {
            this.rows = success;
            this.getCPULoadHistory();
        });
    }

    reload() {
        this.setPage({ offset: 0 });
    }

    getCPULoadHistory() {
        this.rows.map((row, index) => {
            this.barChartData[index] = [
                {
                    data: []
                }
            ];

            this.barChartLabels[index] = [];

            row.history_SystemLoadAverage.map((value, key) => {
                let loadAvg = parseFloat(value);
                let loadPct = (loadAvg * 100 / (1 * 100) ) * 100;

                this.barChartData[index][0].data.push(loadPct);
                this.barChartLabels[index].push(key);
            });
        });
    }

    getCPULoad(data, row) {
        let numCPU = parseInt(row.availableProcessors);
        let loadAvg = parseFloat(row.SystemLoadAverage);
        let loadPct = (loadAvg * 100 / (numCPU * 100) ) * 100;

        return (loadPct.toFixed(2) + ' %');
    }

    getTickMarkUiModel(value) {
        if (value === true) {
            return '<small><span class="fa fa-check"></span></small>';
        } else {
            return '<small><span class="fa fa-remove"></span></small>';
        }
    }

    searchValue(searchTerm) {
        if (searchTerm) {
            if (this.searchService.validateIPaddress(searchTerm)) {
                this.router.navigate(['/tools/chain-viewer/node-details'], { queryParams: { id: searchTerm } });
            }
        }
    }
}
