import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadstatusRoutingModule } from './loadstatus-routing.module';
import { LoadstatusComponent } from './loadstatus.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';


@NgModule({
  declarations: [
    LoadstatusComponent
  ],
  imports: [
    CommonModule,BsDatepickerModule,FormsModule,ReactiveFormsModule, TimepickerModule.forRoot(),
    LoadstatusRoutingModule
  ]
})
export class LoadstatusModule { }
