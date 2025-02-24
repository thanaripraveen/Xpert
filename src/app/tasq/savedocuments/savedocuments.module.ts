import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SavedocumentsRoutingModule } from './savedocuments-routing.module';
import { SavedocumentsComponent } from './savedocuments.component';


@NgModule({
  declarations: [
    SavedocumentsComponent
  ],
  imports: [
    CommonModule,
    SavedocumentsRoutingModule
  ],
  exports : [SavedocumentsComponent]
})
export class SavedocumentsModule { }
