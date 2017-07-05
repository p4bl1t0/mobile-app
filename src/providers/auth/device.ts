import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import config from '../../config';
import { AuthProvider } from './auth';
import { Device } from '@ionic-native/device';

/*
  Generated class for the DeviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DeviceProvider {
  public currentDevice: any;
  public registrationId: string = null;
  private baseUrl = config.API_URL + 'modules/turnosmobile';

  constructor(public device: Device, public authProvider: AuthProvider, public http: Http, public storage: Storage) {
    this.storage.get('current_device').then((device) => {
      console.log("Device: ", device);
      if (device) {
        this.currentDevice = device;
      }
    });
  }

  /**
   * Register in push notifications server
   */
  init() {
    if ((window as any).PushNotification) {
      let push = (window as any).PushNotification.init({
        android: {
        },
        ios: {
          alert: "true",
          badge: true,
          sound: 'false'
        },
        windows: {}
      });

      push.on('registration', (data) => this.onRegister(data));
      push.on('notification', (data) => this.onNotification(data));
      push.on('error', (data) => this.onError(data));

    }
  }

  /**
   * Persist the registration ID
   * @param data
   */
  onRegister(data: any) {
    console.log("Register ID:", data.registrationId);
    this.registrationId = data.registrationId;
  }

  /**
   * Call when notification arrive
   * @param data
   */
  onNotification(data: any) {
    console.log('Notification arrive', data);
  }

  /**
   * Call on error
   * @param data
   */
  onError(data: any) {
    console.log('Notification error', data);
  }

  register() {
    return new Promise((resolve, reject) => {
      if (!this.device.cordova) {
        reject();
        return;
      }

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authProvider.token);

      let params = {
        device_id: this.registrationId,
        device_type: this.device.platform + " " + this.device.version,
        app_version: config.APP_VERSION
      };

      this.http.post(this.baseUrl + '/devices/register', params, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.currentDevice = data;
          this.storage.set('current_device', this.currentDevice);
          resolve(this.currentDevice);
        }, (err) => {
          reject(err);
        });
    });
  }

  update() {
    return new Promise((resolve, reject) => {
      if (!this.device.cordova) {
        reject();
        return;
      }

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authProvider.token);

      let device = {
        id: this.currentDevice.id,
        device_id: this.registrationId,
        device_type: this.device.platform + " " + this.device.version,
        app_version: config.APP_VERSION
      };

      this.http.post(this.baseUrl + '/devices/update', { device }, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.currentDevice = data;
          this.storage.set('current_device', this.currentDevice);
          resolve(this.currentDevice);
        }, (err) => {
          reject(err);
        });
    });
  }

  remove() {
    return new Promise((resolve, reject) => {
      if (!this.device.cordova) {
        reject();
        return;
      }

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authProvider.token);

      this.http.post(this.baseUrl + '/devices/delete', { id: this.currentDevice.id }, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve();
        }, (err) => {
          reject(err);
        });

      this.storage.remove('current_device');
      this.currentDevice = null;

    });
  }

}