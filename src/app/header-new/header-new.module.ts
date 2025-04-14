import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderNewRoutingModule } from './header-new-routing.module';
import { HeaderNewComponent } from './header-new.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModule } from '../profile/profile.module';


@NgModule({
  declarations: [
    HeaderNewComponent
  ],
  imports: [
    CommonModule,FormsModule,NgbModule,ProfileModule,
    HeaderNewRoutingModule
  ],
  exports : [HeaderNewComponent]
})
export class HeaderNewModule { }
