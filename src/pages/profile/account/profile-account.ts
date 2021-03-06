import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { Usuario } from '../../../interfaces/usuario.interface';
import { RegistroUserDataPage } from '../user-data/user-data';
import { TurnosPage } from '../../turnos/turnos';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from '../../../providers/paciente';
import { ToastProvider } from '../../../providers/toast';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-profile-account',
  templateUrl: 'profile-account.html',
})
export class ProfileAccountPage {
  public usuario: Usuario;
  loading: any;
  mostrarMenu: boolean = true;
  fase: number = 1;
  formRegistro: FormGroup;
  submit: boolean = false;
  expand: Boolean = false;

  email: String;
  telefono: String;
  password = '';
  password2 = '';
  old_password = '';

  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  phoneRegex = /^[1-3][0-9]{9}$/;

  constructor(
    public storage: Storage,
    public authService: AuthProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public toast: ToastProvider) {

    this.email = this.authService.user.email;
    this.telefono = this.authService.user.telefono;

  }


  ionViewDidLoad() {
  }

  ionViewDidEnter() {

  }

  onSave() {
    let data: any = {};
    if (this.telefono != this.authService.user.telefono) {
      if (!this.phoneRegex.test(this.telefono as string)) {
        this.toast.danger('INGRESE UN CELULAR CORRECTO');
        return;
      }
      data.telefono = this.telefono;
    }


    if (this.email != this.authService.user.email) {
      if (this.emailRegex.test(this.email as string)) {
        data.email = this.email;
      } else {
        this.toast.danger('INGRESE UN EMAIL CORRECTO');
        return;
      }
    }
    if (this.password.length + this.old_password.length + this.password2.length > 0) {

      if (this.password != this.password2 || this.password.length == 0 || this.old_password.length == 0) {
        this.toast.danger('INGRESE CORRECTAMENTE LAS CONTRASEÑA');
        return;
      }

      data.password = this.password;
      data.old_password = this.old_password;
    }
    this.authService.update(data).then((data) => {
      console.log(data);
      this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
      this.navCtrl.setRoot(TurnosPage);
    }).catch((err) => {
      console.log(err);
      if (err.email) {
        this.toast.danger('EMAIL INCORRECTO');
      } else {
        this.toast.danger('CONTRASEÑA ACTUAL INCORRECTO');
      }
    })
  }

}
