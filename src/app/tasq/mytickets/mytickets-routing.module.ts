import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyticketsComponent } from './mytickets.component';

const routes: Routes = [{ path: '', component: MyticketsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyticketsRoutingModule { }
