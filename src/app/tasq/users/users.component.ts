import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  data = [
    { name: 'John', age: 25 },
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 22 }
  ];

  selectedRow: number | null = null;

  selectRow(index: number) {
    this.selectedRow = index;
  }
  
}
