import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlltasksRoutingModule } from './alltasks-routing.module';
import { AlltasksComponent } from './alltasks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import{BsDatepickerModule} from 'ngx-bootstrap/datepicker'

@NgModule({
  declarations: [
    AlltasksComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule, BsDatepickerModule.forRoot(),
    AlltasksRoutingModule
  ]
})
export class AlltasksModule { }
