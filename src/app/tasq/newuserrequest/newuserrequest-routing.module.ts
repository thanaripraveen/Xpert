import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewuserrequestComponent } from './newuserrequest.component';

const routes: Routes = [{ path: '', component: NewuserrequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewuserrequestRoutingModule { }
