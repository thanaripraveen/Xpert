import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatetaskRoutingModule } from './createtask-routing.module';
import { CreatetaskComponent } from './createtask.component';


@NgModule({
  declarations: [
    CreatetaskComponent
  ],
  imports: [
    CommonModule,
    CreatetaskRoutingModule
  ]
})
export class CreatetaskModule { }
