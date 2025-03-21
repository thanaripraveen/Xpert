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
  { path: 'savedocuments', loadChildren: () => import('./tasq/savedocuments/savedocuments.module').then(m => m.SavedocumentsModule) },
  { path: 'comments', loadChildren: () => import('./tasq/comments/comments.module').then(m => m.CommentsModule) },
  { path: 'details', loadChildren: () => import('./tasq/details/details.module').then(m => m.DetailsModule) },
  { path: 'edittask', loadChildren: () => import('./tasq/edittask/edittask.module').then(m => m.EdittaskModule) },
  { path: 'tasq/usersinfo', loadChildren: () => import('./tasq/usersinfo/usersinfo.module').then(m => m.UsersinfoModule) },
  { path: 'mytickets', loadChildren: () => import('./tasq/mytickets/mytickets.module').then(m => m.MyticketsModule) },
  { path: 'tags', loadChildren: () => import('./tasq/tags/tags.module').then(m => m.TagsModule) },
  { path: 'roles', loadChildren: () => import('./tasq/roles/roles.module').then(m => m.RolesModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
