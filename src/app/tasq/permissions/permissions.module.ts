import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionsComponent } from './permissions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PermissionsComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    PermissionsRoutingModule
  ]
})
export class PermissionsModule { }
