
import {of as observableOf,  Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpClient,
  HttpHeaders,
  HttpParams
} from "@angular/common/http";
import { CommonService } from "../services/common.service";
import { SessionStorageService } from "../services/session-storage.service";
import { PeerService } from "../services/peer.service";
import { OptionsConfigurationService } from "../services/options-configuration.service";
import { AppConstants } from "../config/constants";
import { map } from 'rxjs/operators';
import "rxjs/add/operator/do";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/of";
import * as alertFunctions from "../shared/data/sweet-alerts";

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private sessionStorageService: SessionStorageService,
    private peerService: PeerService,
    private optionsConfigurationService: OptionsConfigurationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    var _this = this;
    return next
      .handle(req)
      .pipe(map(response => {
        if (response instanceof HttpResponse) {
          var url = response.url;
          if (
            url.indexOf("/assets/i18n/pl.json") >= 0 ||
            url.indexOf("/assets/i18n/en.json") >= 0 ||
            url.indexOf("/assets/i18n/de.json") >= 0
          ) {
            return response;
          }

          if (
            url.indexOf("/api/nodes") !== -1 &&
            Array.isArray(response.body) &&
            response.body.length === 0
          ) {
            //This means peer call. See if there is a better identification.
            var endPoints =
              _this.sessionStorageService.getFromSession(
                AppConstants.baseConfig.SESSION_PEER_ENDPOINTS
              ) || _this.peerService.getPeerEndPoints();
            var index = endPoints.indexOf(url);
            if (endPoints[index + 1]) {
              let newReq = req.clone({ url: endPoints[index + 1] });
              return _this.http.request(newReq).subscribe(
                function(success) {
                  return sanitizeJson(success);
                },
                function(error) {
                  return sanitizeJson(error);
                }
              );
            } else {
              return sanitizeJson(response);
            }
          }
          return sanitizeJson(response);
        }

        function sanitizeJson(response) {
          let newRes = response.clone();
          newRes = newRes.clone({
            body: _this.commonService.sanitizeJson(response.body)
          });
          return response;
        }
      }))
      .catch(response => {
        console.log(response);
        if (response instanceof HttpErrorResponse) {
          var url = req.url;
          if (
            url.indexOf("/api/nodes") !== -1 &&
            (response.status === -1 || response.status === 0)
          ) {
            //This means peer call. See if there is a better identification.
            var endPoints =
              _this.sessionStorageService.getFromSession(
                AppConstants.baseConfig.SESSION_PEER_ENDPOINTS
              ) || _this.peerService.getPeerEndPoints();
            var index = endPoints.indexOf(url);
            if (index === -1) {
              index = endPoints.indexOf(url.replace(/\/$/, ""));
            }
            if (endPoints[index + 1]) {
              let newReq = req.clone({ url: endPoints[index + 1] });
              return _this.http.request(newReq);
            } else {
              return observableOf(response);
            }
          }
        }

        if (
          url.indexOf("api") !== -1 &&
          response.params &&
          response.params.requestType &&
          response.params.requestType !== "getPeerState" &&
          response.status === -1
        ) {
          var currentTry =
            _this.sessionStorageService.getFromSession(
              AppConstants.baseConfig.SESSION_CURRENT_TRY
            ) || 0;
          var maxTries = AppConstants.baseConfig.SESSION_MAX_RETRIES;
          if (currentTry > maxTries) {
            _this.sessionStorageService.saveToSession(
              AppConstants.baseConfig.SESSION_CURRENT_TRY,
              0
            );
            return observableOf(response);
          } else {
            _this.sessionStorageService.saveToSession(
              AppConstants.baseConfig.SESSION_CURRENT_TRY,
              currentTry + 1
            );
            _this.peerService.getPeers().subscribe(
              function(success) {
                _this.optionsConfigurationService.loadOptions();
                let url = this.nodeService.getNodeUrl() + "/api";

                let newReq = req.clone({ url });
                return _this.http.request(newReq);
              },
              function(error) {
                return observableOf(response);
              }
            );
          }
        }

        let title: string = _this.commonService.translateAlertTitle("Error");
        let errMsg: string = _this.commonService.translateInfoMessage(
          "network-error"
        );
        alertFunctions
          .InfoAlertBox(title, errMsg, "OK", "error")
          .then((isConfirm: any) => {});

        return observableOf(response);
      });
  }
}
