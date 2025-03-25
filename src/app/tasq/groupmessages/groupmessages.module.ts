import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupmessagesRoutingModule } from './groupmessages-routing.module';
import { GroupmessagesComponent } from './groupmessages.component';


@NgModule({
  declarations: [
    GroupmessagesComponent
  ],
  imports: [
    CommonModule,
    GroupmessagesRoutingModule
  ]
})
export class GroupmessagesModule { }
