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

  // Image Url
  imageUrl = environment.imgUrl;

  @ViewChild('closeOffcanvas') closeOffcanvas: ElementRef | undefined;
  @ViewChild('menuContainer', { static: true }) menuContainer!: ElementRef;
  constructor(public common: common, private api: ApiService, private router: Router) {
  }
  ngOnInit(): void {
    this.api.getUserDetails(this.common.userid).subscribe((res: any) => {
      if (res.StatusCode == 200) {
        console.log(res.UserTasksInfo[0]);

        this.profileData = res.UserTasksInfo[0].UserInfo[0];
        // this.tasks = res.UserTasksInfo[0].Task;
      }
    })

    this.getSidebarData();

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

  getSidebarData() {
    const obj = {
      "roleid": this.common.roleid,
      "flag": "D"
    };

    this.api.getSidebarListService('Permissions/getModules', obj).subscribe(
      (response: any) => {
        console.log('API Response:', response); // Debugging output

        if (response.StatusCode == 200 && response.menulist) {
          const mainModules = response.menulist.filter(
            (item: any) => item.ModParentId == 0 && item.StatusType == 'Y'
          );

          this.menuList = mainModules.map((mainModule: any) => {
            // Filtering child modules (Submenus)
            const submenu = response.menulist.filter(
              (subModule: any) => subModule.ModParentId === mainModule.Identifier && subModule.StatusType === 'Y'
            );

            console.log(`Submenu for ${mainModule.ModuleName}:`, submenu); // Check submenu data

            return {
              ...mainModule,
              path: `/${mainModule.FileName}`,
              active: false,
              submenu: submenu.map(subModule => ({
                ...subModule,
                path: `/${subModule.FileName}`,
                active: false
              }))
            };
          });

          console.log('Processed menuList:', this.menuList); // Debugging output
          this.updateActiveMenu(); // Update active state after fetching data
        } else {
          console.error('Invalid API response:', response);
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
      if (menu.Identifier !== item.Identifier) {
        menu.isOpen = false;
      }
    });
  
    // Toggle current menu
    item.isOpen = !item.isOpen;
  }
  // Detect click outside menu
  @HostListener('document:click', ['$event'])
  closeMenu(event: Event) {
    if (this.menuContainer && !this.menuContainer.nativeElement.contains(event.target)) {
      this.menuList.forEach(menu => menu.isOpen = false);
    }
  }

}
