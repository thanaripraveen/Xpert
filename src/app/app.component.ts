import { Component } from '@angular/core';
import {  NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tasq';
  show: boolean = false;
  currentURL : any = "/"
  // bgColorStyle : any;
  constructor(private router:Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log(event.urlAfterRedirects);
      this.currentURL = event.urlAfterRedirects
      // Hide header for login and page not found routes
      this.show = !(event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/404');
      
    });
  }
}
