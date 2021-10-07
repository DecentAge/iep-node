import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  @Input() progressOptions: any;
  constructor() { 
    this.progressOptions = {
      color:'#ccc',
      percentage: 0
    }
  }

  ngOnInit() {
  }

}
