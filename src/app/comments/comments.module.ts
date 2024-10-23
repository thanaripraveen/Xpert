import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { CommentsRoutingModule } from './comments-routing.module';
import { CommentsComponent } from './comments.component';


@NgModule({
  declarations: [
    CommentsComponent
  ],
  imports: [
    BrowserAnimationsModule, // Necessary for Angular Material animations
    MatDialogModule, // Required for dialogs
    MatButtonModule,
    CommonModule,
    CommentsRoutingModule
  ]
})
export class CommentsModule { }
