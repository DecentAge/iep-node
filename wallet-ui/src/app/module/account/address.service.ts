import {Injectable} from '@angular/core';
import {AppConstants} from '../../config/constants';
import {SessionStorageService} from '../../services/session-storage.service';

@Injectable()
export class AddressService {
    indexedDB = window.indexedDB;
    open: any;

    constructor(public sessionStorageService: SessionStorageService) {
    }

    createTransaction(tableOptions, callback) {
        var tx;
        var db;
        this.open = indexedDB.open('clientIndexedDB', 1);

        this.open.onsuccess = (event) => {
            db = event.target.result;
            try {
                tx = db.transaction(tableOptions, "readwrite");
                callback(tx)
            } catch (e) {
                console.log(e);
            }
            tx.oncomplete = function () {
                db.close();
            };
        };
    }


    add(tableOptions, data, successCallBack, errorCallBack) {

        this.createTransaction(tableOptions, tx => {
            let store = tx.objectStore(tableOptions);

            let errorObj;
            data.forEach(element => {
                let putRequest = store.put(element);
                putRequest.onerror = function (e) {
                    errorObj = e;
                };
            });
            if (errorObj) {
                errorCallBack(errorObj);
            } else {
                successCallBack();
            }
        })
    }

    get(tableOptions, index, publicKey, successCallBack, errorCallBack) {

        this.createTransaction(tableOptions, tx => {
            let store = tx.objectStore(tableOptions);
            let req = store.index(index).openCursor();
            let results = [];
            req.onsuccess = (e) => {
                let cursor;
                if (cursor = e.target.result) {
                    if (cursor.value['publicKey'] == publicKey) {
                        results.push(cursor.value);
                    }
                    cursor["continue"]();
                } else {
                    successCallBack(results);
                }
            };

            req.onerror = errorCallBack;
        })
    }

    clear(tableOptions,index, publicKey, successCallBack, errorCallBack) {
        this.createTransaction(tableOptions, tx => {
            let store = tx.objectStore(tableOptions);
            let req = store.index(index).openCursor();
            req.onsuccess = (e) => {
                let cursor;
                if (cursor = e.target.result) {
                    if (cursor.value['publicKey'] == publicKey) {
                        cursor.delete();
                    }
                    cursor["continue"]();
                } else {
                    successCallBack('success');
                }
            };
            req.onerror = errorCallBack;
        })
    }

    count(tableOptions, successCallBack, errorCallBack) {

    }

    delete(tableOptions, data, successCallBack, errorCallBack) {

        this.createTransaction(tableOptions, tx => {
            let store = tx.objectStore(tableOptions);

            let errorObj;

            let deleteRequest = store.delete(data);
            deleteRequest.onerror = function (e) {
                errorObj = e;
            };

            if (errorObj) {
                errorCallBack(errorObj);
            } else {
                successCallBack();
            }
        })
    }

    createAddress = function (publicKey, accountRS, tag, successCallBack, errorCallBack) {
      this.add(AppConstants.addressBookConfig.tableAddressBook, [{'publicKey': publicKey, 'accountRS': accountRS, 'tags': tag}], successCallBack, errorCallBack);
    };

    getAllContacts = function (publicKey, successCallBack, errorCallBack) {
        if (publicKey) {
            this.get(AppConstants.addressBookConfig.tableAddressBook, 'public_key_idx', publicKey, successCallBack, errorCallBack);
        }
    };

    clearContacts = function (publicKey, successCallback, errorCallback) {
        this.clear(AppConstants.addressBookConfig.tableAddressBook,'public_key_idx', publicKey, successCallback, errorCallback);
    };

    getContactsCount = function (successCallBack, errorCallBack) {
        this.count(AppConstants.addressBookConfig.tableAddressBook, successCallBack, errorCallBack);
    };

    getAccountDetailsFromSession = function (keyName) {
        let accountDetails = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
        if (keyName) {
            return accountDetails[keyName];
        }
        return accountDetails;
    };

    deleteContact = function (publicKey, accountRS, successCallback, errorCallback) {
        // $indexedDB.openStore(addressBookConfig.tableAddressBook, function (contacts) {
        //     let object = [publicKey, accountRS];
        //     contacts.delete(object).then(successCallback, errorCallback);
        // });
        this.delete(AppConstants.addressBookConfig.tableAddressBook, [publicKey, accountRS], successCallback, errorCallback);

    };
    getOption(optionName, publicKey?) {
        let options = this.sessionStorageService.getFromSession(AppConstants.baseConfig.SESSION_APP_OPTIONS);
        if (options) {
            if (typeof options[optionName] === 'undefined') {
                return AppConstants.DEFAULT_OPTIONS[optionName];
            }
            return options[optionName];
        }
        return AppConstants.DEFAULT_OPTIONS[optionName];
    };

}
