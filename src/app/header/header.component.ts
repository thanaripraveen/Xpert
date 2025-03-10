import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { common } from '../common';
import { ApiService } from '../providers/api.service';
import { NavigationEnd, Router } from '@angular/router';
// import { Config } from '../../app/types/Config'
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  // Side Bar variables
  submodules: any = [];
  menuList: any = [];
  currentRoute: string = '';

  // For Binding Profile Date
  profileData: any;
  profileStatusData : any =[];
  statusHover: number | null = null;
  profileStatusText : any ="";
  profileUserStatus : any ="";
  // Image Url
  imageUrl = environment.xpertProfileImg;

  @ViewChild('closeOffcanvas') closeOffcanvas: ElementRef | undefined;
  @ViewChild('menuContainer', { static: true }) menuContainer!: ElementRef;
  constructor(public common: common, private api: ApiService, private router: Router) {
  }

  ngOnInit(): void {
    const obj ={
      "id" : this.common.userid
    }
    this.api.postMethod1('users/getUserDetails',obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.profileData = res.response.UserTasksInfo[0].UserInfo[0];
        this.profileUserStatus = res.response.UserTasksInfo[0].UserInfo[0].UserStatus;
        // this.tasks = res.response.UserTasksInfo[0].Task;
      }
    })
    this.getSidebarData();
    this.bindUserStatus();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this.updateActiveMenu();
      }
      else {
        this.currentRoute = this.router.url;
        this.updateActiveMenu();

      }
    });



  }

  bindUserStatus(){
    const obj = { exp: '' };
    this.api.postMethod1('users/GetUserStatusType', obj).subscribe((res: any) => {
      if (res && res.response) {
        this.profileStatusData = res.response;   
        // console.log();
            
      } else {
        this.profileStatusData = [];
      }
    });
  }
  isStatusOpen = false;
  toggleStatus(event: Event) {
    event.stopPropagation();
    this.isStatusOpen = !this.isStatusOpen;
    this.profileStatusText ="";
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.profileStatusStyles') && this.isStatusOpen) {
      this.isStatusOpen = false;
      this.profileStatusText = "";

    }
  }

  getSidebarData() {
    const obj = {
      "roleid": this.common.roleid,
      "flag": "D"
    };

    this.api.postMethod1('users/getModules', obj).subscribe(
      (res: any) => {
        console.log(res);
        
        if (res.status == 200) {
          const mainModules = res.response.filter(
            (item: any) => item.Mod_ParentId == 0 && item.status == 'Y'
          );
          this.menuList = mainModules.map((mainModule: any) => {
            // Filtering child modules (Submenus)
            const submenu =res.response.filter(
              (subModule: any) => subModule.Mod_ParentId == mainModule.Mod_ID && subModule.status == 'Y'
            );

            return {
              ...mainModule,
              path: `/${mainModule.mod_filename}`,
              active: false,
              submenu: submenu.map(subModule => ({
                ...subModule,
                path: `/${subModule.mod_filename}`,
                active: false
              }))
            };
          });
          this.updateActiveMenu(); // Update active state after fetching data
        } else {
          console.error('Invalid API response:', res);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  updateActiveMenu() {
    this.menuList.forEach(parent => {
      parent.active = parent.path == this.router.url;

      parent.submenu.forEach(child => {
        child.active = child.path == this.router.url;
        if (child.active) {
          parent.active = true; // Ensure parent is also active if child is active
        }
      });
    });
  }

  toggleMenu(item: any,event: Event) {
    event.stopPropagation();
    // Close other open menus
    this.menuList.forEach(menu => {
      if (menu.Mod_ID !== item.Mod_ID) {
        menu.isOpen = false;
      }
    });
  
    // Toggle current menu
    item.isOpen = !item.isOpen;
  }
  // Detect click outside menu
  @HostListener('mouseleave', ['$event'])
  closeMenu(event: Event) {
    if (this.menuContainer && !this.menuContainer.nativeElement.contains(event.target)) {
      this.menuList.forEach(menu => menu.isOpen = false);
    }
  }

}
