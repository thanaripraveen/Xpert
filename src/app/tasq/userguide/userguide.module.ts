import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserguideRoutingModule } from './userguide-routing.module';
import { UserguideComponent } from './userguide.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserguideComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    UserguideRoutingModule
  ]
})
export class UserguideModule { }
