import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { Usuario } from '../../../interfaces/usuario.interface';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from '../../../providers/paciente';
import { ToastProvider } from '../../../providers/toast';
// import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-editor-paciente',
  templateUrl: 'editor-paciente.html',
})
export class EditorPacientePage {
  public usuario: Usuario;
  public paciente: any;

  loading: any;
  mostrarMenu: boolean = false;
  fase: number = 1;
  formRegistro: FormGroup;

  submit: boolean = false;

  constructor(
    public storage: Storage,
    public authService: AuthProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public menu: MenuController,
    public pacienteProvider: PacienteProvider,
    public toast: ToastProvider) {
    //this.menu.swipeEnable(false);
    this.paciente = this.pacienteProvider.paciente;

    this.formRegistro = formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      // telefono: ['', Validators.required],
      // documento: ['', Validators.required],
      sexo: ['', Validators.required],
      // genero: ['', Validators.required],
      // fechaNacimiento: ['', Validators.required],
      nacionalidad: ['', Validators.required],
    });

    this.formRegistro.patchValue({
      nombre: this.paciente.nombre,
      apellido: this.paciente.apellido,
      sexo: this.paciente.sexo,
      nacionalidad: this.paciente.nacionalidad
    });

  }

  ionViewDidLoad() {
    //
  }

  onEdit() {
    let notas = JSON.stringify(this.formRegistro.value);
    let data = {
      reportarError: true,
      notas
    }

    this.pacienteProvider.update(this.paciente.id, data).then(() => {
      this.navCtrl.pop();
      this.toast.success('SOLICITUD ENVIADA CON EXITO!');
    }).catch(() => {
      this.toast.danger('ERROR AL MANDAR LA SOLICITUD');
    });


  }
}
