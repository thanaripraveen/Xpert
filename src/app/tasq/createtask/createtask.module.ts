import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatetaskRoutingModule } from './createtask-routing.module';
import { CreatetaskComponent } from './createtask.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CreatetaskComponent
  ],
  imports: [
    CommonModule,
    CreatetaskRoutingModule,NgbModule
  ],
  exports: [CreatetaskComponent]
})
export class CreatetaskModule { }
