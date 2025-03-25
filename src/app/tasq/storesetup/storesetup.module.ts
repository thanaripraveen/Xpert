import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresetupRoutingModule } from './storesetup-routing.module';
import { StoresetupComponent } from './storesetup.component';


@NgModule({
  declarations: [
    StoresetupComponent
  ],
  imports: [
    CommonModule,
    StoresetupRoutingModule
  ]
})
export class StoresetupModule { }
