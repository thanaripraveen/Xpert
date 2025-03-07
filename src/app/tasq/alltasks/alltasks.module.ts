import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlltasksRoutingModule } from './alltasks-routing.module';
import { AlltasksComponent } from './alltasks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AlltasksComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    AlltasksRoutingModule
  ]
})
export class AlltasksModule { }
