import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavedocumentsComponent } from './savedocuments.component';

const routes: Routes = [{ path: '', component: SavedocumentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SavedocumentsRoutingModule { }
