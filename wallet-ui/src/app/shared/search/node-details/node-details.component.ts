import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { SearchService } from "../search.service";


@Component({
    selector: 'app-node-details',
    templateUrl: './node-details.component.html',
    styleUrls: ['./node-details.component.scss']
})
export class NodeDetailsComponent implements OnInit {
    node: any;

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
    barChartType = 'bar';
    barChartLegend = false;
    barChartColors: Array<any> = [];

    systemLoadAverage: any;
    freeMemory: any;
    requestProcessingTime: any;
    numberOfActivePeers: any;

    constructor(public _location: Location, public activatedRoute: ActivatedRoute, public searchService: SearchService) {
        this.systemLoadAverage = {
            labels: [],
            value: []
        };

        this.freeMemory = {
            labels: [],
            value: []
        };

        this.requestProcessingTime = {
            labels: [],
            value: []
        };

        this.numberOfActivePeers = {
            labels: [],
            value: []
        };
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe( (params: any) => {
            this.getNodeDetails(params.id);
        });
    }

    getNodeDetails(ip) {
        this.searchService.searchIp(ip).subscribe((success: any) => {
            this.node = success;

            this.systemLoadAverage = this.buildChartSystemLoadAverage(this.node.history_SystemLoadAverage);
            this.freeMemory = this.buildChartDataArray(this.node.history_freeMemory);
            this.requestProcessingTime = this.buildChartDataArray(this.node.history_requestProcessingTime);
            this.numberOfActivePeers = this.buildChartDataArray(this.node.history_numberOfActivePeers);
        })
    }

    buildChartDataArray(data) {
        let obj = {
            labels: [],
            value: [
                { data: [] }
            ]
        };

        data.map((value, key) => {
            obj.labels.push(key);
            obj.value[0].data.push(value);
        });

        return obj;
    }

    buildChartSystemLoadAverage(data) {
        let obj = {
            labels: [],
            value: [
                { data: [] }
            ]
        };

        data.map((value, key) => {
            obj.labels.push(key);

            let loadAvg = parseFloat( value );
            let loadPct  = (loadAvg * 100 /  (1 * 100) ) * 100;

            obj.value[0].data.push(loadPct);
        });

        return obj;
    }

    goBack(){
        this._location.back();
    }

}
