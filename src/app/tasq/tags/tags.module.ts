import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TagsComponent
  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,
    TagsRoutingModule
  ]
})
export class TagsModule { }
