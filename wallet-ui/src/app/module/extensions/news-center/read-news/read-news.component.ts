import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { NewsCenterService } from "../news-center.service";

@Component({
    selector: 'app-read-news',
    templateUrl: './read-news.component.html',
    styleUrls: ['./read-news.component.scss']
})
export class ReadNewsComponent implements OnInit, OnDestroy {
    private subscription: any;
    public news: any;

    constructor(private _location: Location, public newsCenterService: NewsCenterService) {

    }

    ngOnInit() {
        this.subscription = this.newsCenterService.readNews.subscribe((data) => {
            this.news = data;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    goBack() {
        this._location.back();
    }

}
