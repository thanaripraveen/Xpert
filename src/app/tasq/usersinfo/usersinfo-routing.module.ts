import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersinfoComponent } from './usersinfo.component';

const routes: Routes = [{ path: '', component: UsersinfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersinfoRoutingModule { }
