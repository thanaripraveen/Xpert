import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewuserrequestRoutingModule } from './newuserrequest-routing.module';
import { NewuserrequestComponent } from './newuserrequest.component';


@NgModule({
  declarations: [
    NewuserrequestComponent
  ],
  imports: [
    CommonModule,
    NewuserrequestRoutingModule
  ]
})
export class NewuserrequestModule { }
