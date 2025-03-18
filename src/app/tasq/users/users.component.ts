import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  showFirstDiv = true;

  toggleDivs() {
    this.showFirstDiv = !this.showFirstDiv;
  }
}
