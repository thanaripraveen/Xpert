import { NgModule,CUSTOM_ELEMENTS_SCHEMA, createComponent  } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreatetaskComponent } from '../tasq/createtask/createtask.component';


@NgModule({
  declarations: [
    ProfileComponent,
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    ProfileRoutingModule,NgbModule
  ],
  exports: [ProfileComponent],
  providers : [DatePipe],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ProfileModule { }
