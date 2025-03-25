import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowdoiComponent } from './howdoi.component';

const routes: Routes = [{ path: '', component: HowdoiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HowdoiRoutingModule { }
