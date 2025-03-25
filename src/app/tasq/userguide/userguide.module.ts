import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserguideRoutingModule } from './userguide-routing.module';
import { UserguideComponent } from './userguide.component';


@NgModule({
  declarations: [
    UserguideComponent
  ],
  imports: [
    CommonModule,
    UserguideRoutingModule
  ]
})
export class UserguideModule { }
