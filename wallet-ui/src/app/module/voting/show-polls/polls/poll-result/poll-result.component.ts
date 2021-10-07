import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

import * as chartsData from '../../../../../shared/configs/ngx-charts.config';
import {VotingService} from '../../../voting.service';
import {AppConstants} from '../../../../../config/constants';

@Component({
    selector: 'app-poll-result',
    templateUrl: './poll-result.component.html',
    styleUrls: ['./poll-result.component.scss']
})
export class PollResultComponent implements OnInit {
    poll: any;
    pollResults: any;
    pieChartData: any;

    constructor(private _location: Location, private route: ActivatedRoute, public votingService: VotingService) {
        this.poll = {
            name: '',
            description: ''
        };

        this.pollResults = {
            total: 0
        };
    }

    //Pie Charts

    // options
    pieChartShowLegend = chartsData.pieChartShowLegend;

    pieChartColorScheme = chartsData.pieChartColorScheme;
    // pie
    pieChartShowLabels = chartsData.pieChartShowLabels;
    pieChartExplodeSlices = chartsData.pieChartExplodeSlices;
    pieChartDoughnut = chartsData.pieChartDoughnut;
    pieChartGradient = chartsData.pieChartGradient;
    pieChartLegendTitle = 'Options';


    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            this.getPollDetails(params.id);
            this.getPollResults(params.id);
        });
    }

    getPollDetails(pollId) {
        if (pollId != 'undefined') {
            this.votingService.getPoll(pollId).subscribe((pollDetails: any) => {
                this.poll = pollDetails;
            });
        } else {
            this._location.back();
        }
    }

    getPollResults(pollId) {
        if (pollId != 'undefined') {
            this.votingService.getPollData(pollId).subscribe((pollResults: any) => {
                let divisor = 1;
                if (pollResults.votingModel !== 0) {
                    divisor = AppConstants.baseConfig.TOKEN_QUANTS;
                }
                this.pollResults.total = this.sumResults(pollResults.results, divisor);
                this.pollResults.pollData = this.getPollData(pollResults.options, pollResults.results, divisor, this.pollResults.total);
                this.pieChartData = this.pollResults.pollData.map((option) => {
                    return {
                        name: option.key,
                        value: option.percentage
                    }
                })
            });
        } else {
            this._location.back();
        }
    }

    sumResults(results, divisor) {
        let sum = 0;

        results.map((value: any, index: number) => {
            sum = sum + (value.result / divisor);
            return true;
        });

        return sum;
    }

    getPollData(labels, results, divisor, total) {
        return results.map((value: any, index: number) => {
            return {
                key: labels[index],
                value: value.result / divisor,
                percentage: ((value.result / divisor) * 100) / total || 0
            }
        });
    }

    goBack() {
        this._location.back();
    }
}
