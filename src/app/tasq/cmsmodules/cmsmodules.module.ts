import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsmodulesRoutingModule } from './cmsmodules-routing.module';
import { CmsmodulesComponent } from './cmsmodules.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CmsmodulesComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    CmsmodulesRoutingModule
  ]
})
export class CmsmodulesModule { }
