import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserguideRoutingModule } from './userguide-routing.module';
import { UserguideComponent } from './userguide.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';



@NgModule({
  declarations: [
    UserguideComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,EditorComponent,
    UserguideRoutingModule
  ],
  providers: [  { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }]
})
export class UserguideModule { }
