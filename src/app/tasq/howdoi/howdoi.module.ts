import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HowdoiRoutingModule } from './howdoi-routing.module';
import { HowdoiComponent } from './howdoi.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    HowdoiComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,AngularEditorModule,
    HowdoiRoutingModule
  ]
})
export class HowdoiModule { }
