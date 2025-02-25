import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EdittaskRoutingModule } from './edittask-routing.module';
import { EdittaskComponent } from './edittask.component';


@NgModule({
  declarations: [
    EdittaskComponent
  ],
  imports: [
    CommonModule,
    EdittaskRoutingModule
  ],
  exports : [EdittaskComponent]
})
export class EdittaskModule { }
