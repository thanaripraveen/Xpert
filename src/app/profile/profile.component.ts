import { Component } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(public dialog: MatDialog) {}
  openModal(): void {
    const dialogRef = this.dialog.open(CommentsComponent, {
      width: '60rem',
      height : '35rem',
      disableClose: true,
      data: { /* Pass data here if needed */ }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the modal closes if necessary
    });
  }
}
