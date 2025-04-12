import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupmessagesRoutingModule } from './groupmessages-routing.module';
import { GroupmessagesComponent } from './groupmessages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    GroupmessagesComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,BsDatepickerModule.forRoot(),AngularEditorModule,
    GroupmessagesRoutingModule
  ]
})
export class GroupmessagesModule { }
