import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {VotingService} from '../../../voting.service';

@Component({
    selector: 'app-poll-details',
    templateUrl: './poll-details.component.html',
    styleUrls: ['./poll-details.component.scss']
})
export class PollDetailsComponent implements OnInit {
    poll: any;

    constructor(private _location: Location, private route: ActivatedRoute, public votingService: VotingService) {
        this.poll = {
            options: []
        }
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            this.getPollDetails(params.id);
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

    goBack() {
        this._location.back();
    }

}
