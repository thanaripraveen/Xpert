import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HowdoiRoutingModule } from './howdoi-routing.module';
import { HowdoiComponent } from './howdoi.component';


@NgModule({
  declarations: [
    HowdoiComponent
  ],
  imports: [
    CommonModule,
    HowdoiRoutingModule
  ]
})
export class HowdoiModule { }
