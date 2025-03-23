import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsmodulesRoutingModule } from './cmsmodules-routing.module';
import { CmsmodulesComponent } from './cmsmodules.component';


@NgModule({
  declarations: [
    CmsmodulesComponent
  ],
  imports: [
    CommonModule,
    CmsmodulesRoutingModule
  ]
})
export class CmsmodulesModule { }
