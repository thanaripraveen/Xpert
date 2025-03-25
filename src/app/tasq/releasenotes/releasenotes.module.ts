import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleasenotesRoutingModule } from './releasenotes-routing.module';
import { ReleasenotesComponent } from './releasenotes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    ReleasenotesComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,AngularEditorModule,
    ReleasenotesRoutingModule
  ]
})
export class ReleasenotesModule { }
