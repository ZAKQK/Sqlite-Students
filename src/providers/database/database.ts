import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '../../../node_modules/@ionic-native/sqlite';
import { Platform } from '../../../node_modules/ionic-angular';
import { BehaviorSubject } from 'rxjs/Rx'

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  db: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public http: HttpClient, private sqlite: SQLite, private plt: Platform) {
    console.log('Hello DatabaseProvider Provider');
    this.databaseReady = new BehaviorSubject(false);
    this.plt.ready().then(() => {
      this.openOrCreate();
    })
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  openOrCreate() {
    console.log('Open/Create DB')
    return this.sqlite.create({
      name: 'student_data.db',
      location: 'default',

    }).then((db: SQLiteObject) => {
      this.db = db;
      return this.db.sqlBatch([
        'CREATE TABLE IF NOT EXISTS class(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32))',
        'CREATE TABLE IF NOT EXISTS student(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32))'
      ]).then((data) => {
        console.log('After Batch')
        this.databaseReady.next(true);
        return data;
      });
    })
  }

  addStudents(data){
    return this.db.executeSql('INSERT INTO student (name) VALUES (?)', [data]);
  }

  getStudents(){
    return this.db.executeSql('SELECT * FROM student', null).then((data) => {
      let results = [];
      for (let i = 0; i < data.rows.length; i++){
        results.push({name: data.rows.item(i).name, id: data.rows.item(i).id})
      }
      return results;
    });
  }

  addClass(data){
    return this.db.executeSql('INSERT INTO class (name) VALUES (?)', [data]);
  }

  getCsass(){
    return this.db.executeSql('SELECT * FROM class', null).then((data) => {
      let results = [];
      for (let i = 0; i < data.rows.length; i++){
        results.push({name: data.rows.item(i).name, id: data.rows.item(i).id})
      }
      return results;
    }, err => {
      console.log("ERROR", err);
      return [];
    });
  }


}
