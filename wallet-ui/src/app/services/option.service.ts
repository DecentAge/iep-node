import { Injectable, EventEmitter } from '@angular/core';
import { AppConstants } from '../config/constants';
import { SessionStorageService } from './session-storage.service';

@Injectable()
export class OptionService {

    indexedDB = window.indexedDB;
    open: any;

    watchList: any = [];

    public optionsChanged$: EventEmitter<any>;

    constructor(public sessionStorageService: SessionStorageService) {

        this.open = indexedDB.open("clientIndexedDB", 1);

        this.open.onupgradeneeded = () => {
            var db = this.open.result;

            var optionStore = db.createObjectStore(AppConstants.optionsConfig.tableOptions, { keyPath: ['publicKey', 'optionName'] });
            optionStore.createIndex('value_idx', 'value', { unique: false });
            optionStore.createIndex('public_key_idx', 'publicKey', { unique: false });
            optionStore.createIndex('option_name_idx', 'optionName', { unique: false });

            // account store created here, will move it to proper module
            var accountStore = db.createObjectStore(AppConstants.addressBookConfig.tableAddressBook, { keyPath: ['publicKey', 'accountRS'] });
            accountStore.createIndex('tag_idx', 'tags', {unique: false});
            accountStore.createIndex('public_key_idx', 'publicKey', {unique: false});
            accountStore.createIndex('account_rs_idx', 'accountRS', {unique: false});
        }

        this.open.onsuccess = (event) => {
            var db = event.target.result;
        };

        this.optionsChanged$ = new EventEmitter();

        this.optionsChanged$.subscribe(res => {
            this.applyChanges();
        });
    }

    createTransaction(tableOptions, callback) {
        var db = this.open.result;
        var tx;
        try {
            tx = db.transaction(tableOptions, "readwrite");
            callback(tx)
        } catch (e) {
            console.log(e);
        }
        // tx.oncomplete = function () {
        //     db.close();
        // };
    }

    add(tableOptions, data, successCallBack, errorCallBack) {

        this.createTransaction(tableOptions, tx => {
            let store = tx.objectStore(tableOptions);

            var errorObj;
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

    emitOptionsChanged(){
        this.optionsChanged$.emit();
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

    clear(tableOptions, index, publicKey, successCallBack, errorCallBack) {
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

    insertOption(publicKey, optionName, value, successCallBack, errorCallBack) {
        this.add(AppConstants.optionsConfig.tableOptions, [{ 'publicKey': publicKey, 'optionName': optionName, 'value': value }], successCallBack, errorCallBack);
    };

    insertOptions(values, successCallBack, errorCallBack) {
        this.add(AppConstants.optionsConfig.tableOptions, values, successCallBack, errorCallBack);
    };

    updateOptions(values, successCallBack, errorCallBack) {
        this.add(AppConstants.optionsConfig.tableOptions, values, successCallBack, errorCallBack);
    };

    getAllOptions(publicKey, successCallBack, errorCallBack) {
        if (publicKey) {
            this.get(AppConstants.optionsConfig.tableOptions, 'public_key_idx', publicKey, successCallBack, errorCallBack);
        }
    };

    clearOptions(publicKey, successCallback, errorCallback) {
        this.clear(AppConstants.optionsConfig.tableOptions,'public_key_idx', publicKey, successCallback, errorCallback);
    };

    getContactsCount(successCallBack, errorCallBack) {
        this.count(AppConstants.addressBookConfig.tableAddressBook, successCallBack, errorCallBack);
    };

    loadOptions(publicKey, successCallback, errorCallback) {
        this.getAllOptions(publicKey, options => {
            let finalOptions = JSON.parse(JSON.stringify(AppConstants.DEFAULT_OPTIONS));

            for (let i = 0; i < options.length; i++) {
                let optionObject = options[i];
                finalOptions[optionObject.optionName] = optionObject.value;
            }
            this.sessionStorageService.saveToSession(AppConstants.baseConfig.SESSION_APP_OPTIONS, finalOptions);
            successCallback(finalOptions);
        }, (e) => {
            errorCallback(e);
        });
    };

    clearContacts(successCallback, errorCallback) {
        //this.clear(AppConstants.optionsConfig.tableOptions, successCallback, errorCallback);
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

    pushToWatch(view) {
        this.watchList.push(view)
    }

    applyChanges() {
        let publicKey = this.sessionStorageService.getFromSession(AppConstants.loginConfig.SESSION_ACCOUNT_DETAILS_KEY);
        let isExtensionEnabled = this.getOption('EXTENSIONS', publicKey);
        this.watchList.forEach(view => {
            if (isExtensionEnabled) {
                view.viewContainer.clear();
                view.viewContainer.createEmbeddedView(view.templateRef);
            } else {
                view.viewContainer.clear();
            }
        });
    }

}