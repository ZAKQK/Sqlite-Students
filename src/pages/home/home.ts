import { Component } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  students = [];

  constructor(public navCtrl: NavController, private databaseProvider: DatabaseProvider, 
    private modelCtrl: ModalController, private toastCtrl: ToastController) {

  }

  ionViewDidEnter() {
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadStudents();
      }
    })
  }

  loadStudents() {
    this.databaseProvider.getStudents().then((res) => {
      this.students = res;
    })
  }

  addStudents() {
    // this.navCtrl.push(AddStudentsPage);
    let modal = this.modelCtrl.create("AddStudentsPage")
    modal.onDidDismiss((data) => {
      if(data && data.reload) {
        let toast = this.toastCtrl.create({
          message: 'New Student Added!',
          duration: 2000
        })
        this.loadStudents();
      }
    });
    modal.present();
  }

}
