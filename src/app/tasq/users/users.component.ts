import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  spinner : boolean = false;
  gridForm : boolean = true;
  constructor(){}

  ngOnInit(){

  }

  addNewUser(){

  }

}
