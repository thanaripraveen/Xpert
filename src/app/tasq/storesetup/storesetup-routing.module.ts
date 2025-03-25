import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoresetupComponent } from './storesetup.component';

const routes: Routes = [{ path: '', component: StoresetupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresetupRoutingModule { }
