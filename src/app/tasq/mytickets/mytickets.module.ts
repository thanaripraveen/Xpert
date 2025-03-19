import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyticketsRoutingModule } from './mytickets-routing.module';
import { MyticketsComponent } from './mytickets.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MyticketsComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    MyticketsRoutingModule
  ]
})
export class MyticketsModule { }
