import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    ProfileRoutingModule
  ],
  exports: [ProfileComponent],
  providers : [DatePipe],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ProfileModule { }
