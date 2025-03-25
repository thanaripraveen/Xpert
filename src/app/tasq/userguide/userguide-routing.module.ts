import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserguideComponent } from './userguide.component';

const routes: Routes = [{ path: '', component: UserguideComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserguideRoutingModule { }
