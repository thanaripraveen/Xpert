import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from './header/header.module';
import { ProfileModule } from './profile/profile.module';
import { NgxEditorModule } from 'ngx-editor';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HeaderNewModule } from './header-new/header-new.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,HttpClientModule,
    AppRoutingModule,
    HeaderModule,
    ProfileModule,
    HeaderNewModule,
    BrowserAnimationsModule,BsDatepickerModule.forRoot(),
    NgxEditorModule, // Add NgxEditorModule here
    ToastrModule.forRoot({
      // Optionally configure the global default options here
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    AngularEditorModule
    
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
