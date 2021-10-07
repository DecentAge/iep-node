import { Injectable } from '@angular/core';

@Injectable()
export class DataStoreService {

  constructor() { }

  public static data: any = {};

  public static set(key: any, data: any) {
    DataStoreService.data[key] = data;
  }

  public static get(key: any) {
    return DataStoreService.data[key];
  }

}
