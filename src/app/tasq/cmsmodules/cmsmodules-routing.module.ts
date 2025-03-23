import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsmodulesComponent } from './cmsmodules.component';

const routes: Routes = [{ path: '', component: CmsmodulesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsmodulesRoutingModule { }
