import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewuserrequestRoutingModule } from './newuserrequest-routing.module';
import { NewuserrequestComponent } from './newuserrequest.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NewuserrequestComponent
  ],
  imports: [
    CommonModule,FormsModule,
    NewuserrequestRoutingModule
  ]
})
export class NewuserrequestModule { }
