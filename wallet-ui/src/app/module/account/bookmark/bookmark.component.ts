import {EventEmitter, Component, OnInit} from '@angular/core';
import {AddressService} from '../address.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {
  bookMarkUpdateSubject: Subject<any> = new Subject();
  contact: any = {
    account: '',
    tag: ''
  };
  constructor(public addressService: AddressService) {
  }

  ngOnInit() {
  }

  createNewContact(accountRs, tag) {
      let publicKey = this.addressService.getAccountDetailsFromSession('publicKey');
      this.addressService.createAddress(publicKey, accountRs, tag, () => {
          this.bookMarkUpdateSubject.next('bookmark-update');
          this.contact = {
              account: '',
              tag: ''
          };
      }, (e) => {
          console.log('error ' + e);
      });
  };
}
