import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersinfoRoutingModule } from './usersinfo-routing.module';
import { UsersinfoComponent } from './usersinfo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersinfoComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    UsersinfoRoutingModule
  ]
})
export class UsersinfoModule { }
