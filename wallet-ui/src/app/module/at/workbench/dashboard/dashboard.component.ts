import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    displayTab: string = "simple";
    showCompiler: boolean = false;

    constructor(public router: Router) {

    }

    ngOnInit() {
        $(document).ready(function () {
            var widthOfList = function () {
                var itemsWidth = 0;
                $('.at-list li').each(function () {
                    var itemWidth = $(this).outerWidth();
                    itemsWidth += itemWidth;
                });
                return itemsWidth;
            };

            var widthOfHidden = function () {
                return (($('.tab-wrapper').outerWidth()) - widthOfList() - getLeftPosition());
            };

            var getLeftPosition = function () {
                return $('.at-list').position().left;
            };

            var reAdjust = function () {
                if (($('.tab-wrapper').outerWidth()) < widthOfList()) {
                    $('.scroller-right').show();
                } else {
                    $('.scroller-right').hide();
                }

                if (getLeftPosition() < 0) {
                    $('.scroller-left').show();
                } else {
                    $('.item').animate({
                        left: "-=" + getLeftPosition() + "px"
                    }, 'slow');
                    $('.scroller-left').hide();
                }
            }

            reAdjust();

            $(window).on('resize', function (e) {
                reAdjust();
            });

            $('.scroller-right').click(function () {
                var left = -200;

                if ((widthOfHidden() - left) > 0) {
                    left = widthOfHidden();
                }

                $('.at-list').animate({
                    left: "+=" + left + "px"
                }, 'fast', function () {
                    if (getLeftPosition() >= 0) {
                        $('.scroller-left').fadeOut('slow');
                    } else {
                        $('.scroller-left').fadeIn('slow');
                    }

                    if (parseInt(widthOfHidden().toString(), 0) >= -0) {
                        $('.scroller-right').fadeOut('slow');
                    } else {
                        $('.scroller-right').fadeIn('slow');
                    }
                });
            });

            $('.scroller-left').click(function () {
                var left = -200;

                if ((getLeftPosition() - left) > 0) {
                    left = getLeftPosition();
                }

                $('.at-list').animate({
                    left: "-=" + left + "px"
                }, 'fast', function () {
                    if (getLeftPosition() >= 0) {
                        $('.scroller-left').fadeOut('slow');
                    } else {
                        $('.scroller-left').fadeIn('slow');
                    }

                    if (parseInt(widthOfHidden().toString(), 0) >= -0) {
                        $('.scroller-right').fadeOut('slow');
                    } else {
                        $('.scroller-right').fadeIn('slow');
                    }
                });
            });
        })
    }

    redirectToCompiler() {
        this.router.navigateByUrl('/at/workbench/compiler');
    }

    showTab(type) {
        this.displayTab = type;
    }

    copyText(element, tooltip) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = element.innerText.trim();
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        tooltip.open();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        setTimeout(() => {
            tooltip.close();
        }, 5000);
    }

}
