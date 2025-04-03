import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EdittaskRoutingModule } from './edittask-routing.module';
import { EdittaskComponent } from './edittask.component';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    EdittaskComponent
  ],
  imports: [
    CommonModule,AngularEditorModule,
    EdittaskRoutingModule
  ],
  exports : [EdittaskComponent]
})
export class EdittaskModule { }
