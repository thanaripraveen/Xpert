import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserstatusRoutingModule } from './userstatus-routing.module';
import { UserstatusComponent } from './userstatus.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserstatusComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    UserstatusRoutingModule
  ]
})
export class UserstatusModule { }
