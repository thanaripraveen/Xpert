import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlltasksRoutingModule } from './alltasks-routing.module';
import { AlltasksComponent } from './alltasks.component';


@NgModule({
  declarations: [
    AlltasksComponent
  ],
  imports: [
    CommonModule,
    AlltasksRoutingModule
  ]
})
export class AlltasksModule { }
