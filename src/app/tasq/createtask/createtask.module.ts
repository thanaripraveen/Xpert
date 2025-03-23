import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatetaskRoutingModule } from './createtask-routing.module';
import { CreatetaskComponent } from './createtask.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  declarations: [
    CreatetaskComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,AngularEditorModule,
    CreatetaskRoutingModule
  ],
  exports: [CreatetaskComponent]
})
export class CreatetaskModule { }
