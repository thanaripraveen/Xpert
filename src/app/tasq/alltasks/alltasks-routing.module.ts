import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlltasksComponent } from './alltasks.component';

const routes: Routes = [{ path: '', component: AlltasksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlltasksRoutingModule { }
