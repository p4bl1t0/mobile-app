import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import * as moment from 'moment/moment';
import config from '../config';

// providers
import { AuthProvider } from './auth/auth';

@Injectable()
export class AgendasProvider {
  public user: any;
  private baseUrl = config.API_URL + 'modules/turnos';

  constructor(
    public http: Http,
    public storage: Storage,
    public authProvider: AuthProvider) {

    this.user = this.authProvider.user;
  }

  get(params) {
    return new Promise((resolve, reject) => {
      let headers = this.authProvider.getHeaders();
      debugger;
      this.http.get(this.baseUrl + '/agenda', { search: params, headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  patch(id, params) {
    return new Promise((resolve, reject) => {
      let headers = this.authProvider.getHeaders();
      this.http.patch(this.baseUrl + '/agenda/' + id, params, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
}

