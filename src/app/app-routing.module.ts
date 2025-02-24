import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }, 
  { path: 'header', loadChildren: () => import('./header/header.module').then(m => m.HeaderModule) },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
  { path: 'dashboard', loadChildren: () => import('./tasq/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'createtask', loadChildren: () => import('./tasq/createtask/createtask.module').then(m => m.CreatetaskModule) },
  { path: 'Alltasks', loadChildren: () => import('./tasq/alltasks/alltasks.module').then(m => m.AlltasksModule) },
  { path: 'admusers', loadChildren: () => import('./tasq/users/users.module').then(m => m.UsersModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
