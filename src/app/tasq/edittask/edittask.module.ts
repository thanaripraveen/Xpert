import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EdittaskRoutingModule } from './edittask-routing.module';
import { EdittaskComponent } from './edittask.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    EdittaskComponent
  ],
  imports: [
    CommonModule,AngularEditorModule,FormsModule,ReactiveFormsModule,BsDatepickerModule,AngularEditorModule,
    EdittaskRoutingModule
  ],
  exports : [EdittaskComponent]
})
export class EdittaskModule { }
