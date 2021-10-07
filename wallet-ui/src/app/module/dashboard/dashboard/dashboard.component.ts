
import {forkJoin as observableForkJoin,  Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../../services/session-storage.service';
import { DashboardService } from '../dashboard.service';
import { RootScope } from '../../../config/root-scope';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    accountRs: string;
    accountValuation: number;
    balanceTQT: any;
    selectedLanguage: string;

    constructor(private router: Router,
        private dashboardService: DashboardService,
        public translate: TranslateService,
        private sessionStorageService: SessionStorageService,
        private amChartsService: AmChartsService) {
        this.accountValuation = 0.00;
        this.accountRs = "";
    }

    private chart: AmChart;

    ngOnInit() {
        this.getAccountAssetsAndBalances();
        this.getMarketData();
    }

    renderChart(data) {

        this.chart = this.amChartsService.makeChart("chartdiv", {
            type: "serial",
            theme: "light",
            // "marginRight: 80,
            "fontFamily": "Montserrat",
            pathToImages: "/assets/images/",
            panEventsEnabled: false,
            dataProvider: data,
            color: "#2B2929",
            maxZoomFactor: 20,
            valueAxes: [{
                position: "left",
                title: "Price (USD)"
            }],
            graphs: [{
                id: "g1",
                fillAlphas: 0.4,
                valueField: "value",
                fillColors: ["#E72D45", "#ffffff"],
                lineAlpha: 1,
                lineColor: "#E72D45",
                lineThickness: 2,
                balloonText: "<div> 1 XIN: <b>[[value]]</b> USD </div>"
            }],
            plotAreaBorderColor: '#F00',
            // "chartScrollbar: {
            //     "graph: "g1",
            //     "scrollbarHeight: 80,
            //     "backgroundAlpha: 0,
            //     "selectedBackgroundAlpha: 0.1,
            //     "selectedBackgroundColor: "#888888",
            //     "graphFillAlpha: 0,
            //     "graphLineAlpha: 0.5,
            //     "selectedGraphFillAlpha: 0,
            //     "selectedGraphLineAlpha: 1,
            //     "autoGridCount: true,
            //     "color: "#AAAAAA"
            // },
            // chartScrollbarSettings: {
            //     "graph: "g1",
            //     "enabled: false
            // },
            chartCursor: {
                // "categoryBalloonDateFormat: "JJ:NN, DD MMMM",
                cursorPosition: "mouse",
                zoomable: false
            },
            categoryField: "date",
            categoryAxis: {
                parseDates: true,
                minPeriod: "mm",
                gridAlpha: 0.4,
                gridColor: "#D4D2D2",
            },
            panelsSettings: {
                panEventsEnabled: false,
                usePrefixes: false
            },
            export: {
                enabled: true,
                // "dateFormat: "YYYY-MM-DD HH:NN:SS"
            },
            balloon: {
                "borderColor": "#000000",
                "borderThickness": 0,
                "color": "#FFFFFF",
                "fillColor": "#000000",
                "offsetY": 4
            }
        });
    }

    ngOnDestroy() {
        if (this.chart) {
            this.amChartsService.destroyChart(this.chart);
        }
    }

    getAccountAssetsAndBalances() {

        RootScope.onChange.subscribe(data => {
            this.accountRs = data['accountRs'];
            this.balanceTQT = data['balanceTQT'];
        });
        RootScope.set({}); //force load again TODO: need to change implementation/reload
    };

    getMarketData() {
        // this.dashboardService.getMarketData('XIN', 'BTC').subscribe(data => {
        //     if(data.Response == 'Success'){
        //         let points = [];
        //         data.Data.map((val) => {
        //             points.push({
        //                 date: val.time * 1000,
        //                 value: val.close
        //             });
        //         });
        //         this.renderChart(points);
        //     }
        // })

        observableForkJoin(this.dashboardService.getMarketData('BTC', 'USD'), this.dashboardService.getMarketData('XIN', 'BTC'))
            .subscribe((successNext: any) => {
                let [btcToUsdResult, xinToBtcResult] = successNext;

                if (btcToUsdResult.Response == 'Success' && xinToBtcResult.Response == 'Success') {
                    let points = [];
                    for (let i = 0; i < xinToBtcResult.Data.length; i++) {
                        let value = 0;//xinToBtcResult.Data[i].close

                        if (btcToUsdResult.Data[i].time == xinToBtcResult.Data[i].time) {
                            points.push({
                                date: xinToBtcResult.Data[i].time * 1000,
                                value: xinToBtcResult.Data[i].close * btcToUsdResult.Data[i].close
                            });
                        }
                    }
                    this.renderChart(points);
                }
            });
    }

    chartClicked() {

    }

    navigateTo(route) {
        this.router.navigate([route]);
    }

}
