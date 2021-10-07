import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable ,  of } from 'rxjs';
import { isArray } from 'util';

@Injectable()
export class HttpProviderService {

    constructor(private http: HttpClient) {

    }

    get(baseUrl: string, endpointUrl: string, queryParams?: object) {
        let params = new HttpParams();
        for (var key in queryParams) {
            if (typeof (queryParams[key]) != "undefined" && queryParams[key] != null) {
                if (isArray(queryParams[key])) {
                    queryParams[key].forEach(element => {
                        params = params.append(key, element);
                    });
                } else {
                    params = params.append(key, queryParams[key]);
                }
            }
        }

        return this.http.get(baseUrl + '/' + endpointUrl, { params })
            .pipe(
                tap(response => this.log('get: ' + endpointUrl)),
                // catchError(this.handleError('error', []))
            );

    }

    post(baseUrl: string, endpointUrl: string, queryParams: object) {
        let params = new HttpParams();
        for (let key in queryParams) {
            if (typeof (queryParams[key]) != "undefined" && queryParams[key] != null) {
                if (isArray(queryParams[key])) {
                    queryParams[key].forEach(element => {
                        params = params.append(key, element);
                    });
                } else {
                    params = params.append(key, queryParams[key]);
                }
            }
        }

        return this.http.post(baseUrl + '/' + endpointUrl, params)
            .pipe(
                tap(response => this.log('post: ' + endpointUrl)),
                // catchError(this.handleError('error', []))
            );
    }

    handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.error(error);
            // Let the app keep running by returning an empty result.

            if (error.status == 404) {
                return of<any>({ error: "not found" });
            }
            return of(result as T);
        };
    }

    log(message: string) {
        // console.log(message);
    }
}
