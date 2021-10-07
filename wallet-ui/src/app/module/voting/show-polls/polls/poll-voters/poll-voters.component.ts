import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {VotingService} from '../../../voting.service';
import {DataStoreService} from '../../../../../services/data-store.service';
import {SearchService} from '../../../../../shared/search/search.service';


export class Page {
    //The number of elements in the page
    size: number = 10;
    //The total number of elements
    totalElements: number = 1000;
    //The total number of pages
    totalPages: number = 100;
    //The current page number
    pageNumber: number = 0;
}

@Component({
    selector: 'app-poll-voters',
    templateUrl: './poll-voters.component.html',
    styleUrls: ['./poll-voters.component.scss']
})
export class PollVotersComponent implements OnInit {
    voters: any;
    page = new Page();

    constructor(private _location: Location, private route: ActivatedRoute, private router: Router, public votingService: VotingService, public searchService: SearchService) {
        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            this.getPollVotes(params.id);
        });
    }

    getPollVotes(pollId) {
        this.votingService.getPollVotes(pollId, this.page.pageNumber * 10, ((this.page.pageNumber + 1) * 10) - 1).subscribe((pollVotes: any) => {
            this.voters = pollVotes.votes;
            this.page.totalElements = pollVotes.votes.length;
        })
    }

    goToDetails(transactionId) {
        this.searchService.searchTransactionById(transactionId).subscribe((success: any) => {
            // DataStoreService.set('transaction-details', success);
            DataStoreService.set('transaction-details', {id: transactionId, type: 'onlyID', view: 'transactionDetail'});
            this.router.navigate(['/voting/show-polls/voters/transaction-details']);
        });
    }

    goBack() {
        this._location.back();
    }

}
