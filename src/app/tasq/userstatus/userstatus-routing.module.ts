import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserstatusComponent } from './userstatus.component';

const routes: Routes = [{ path: '', component: UserstatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserstatusRoutingModule { }
