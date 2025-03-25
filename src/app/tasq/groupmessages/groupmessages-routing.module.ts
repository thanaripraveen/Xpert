import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupmessagesComponent } from './groupmessages.component';

const routes: Routes = [{ path: '', component: GroupmessagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupmessagesRoutingModule { }
