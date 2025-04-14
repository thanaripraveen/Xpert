import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderNewComponent } from './header-new.component';

const routes: Routes = [{ path: '', component: HeaderNewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeaderNewRoutingModule { }
