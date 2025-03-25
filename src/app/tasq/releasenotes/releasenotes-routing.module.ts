import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReleasenotesComponent } from './releasenotes.component';

const routes: Routes = [{ path: '', component: ReleasenotesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReleasenotesRoutingModule { }
