import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { common } from '../common';
import { ApiService } from '../providers/api.service';
import { NavigationEnd, Router } from '@angular/router';
// import { Config } from '../../app/types/Config'
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { CreatetaskComponent } from '../tasq/createtask/createtask.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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

  spinner : boolean = false;
  @ViewChild('closeOffcanvas') closeOffcanvas: ElementRef | undefined;
  @ViewChild('menuContainer', { static: true }) menuContainer!: ElementRef;
  constructor(public common: common, private api: ApiService, private router: Router,
    private toastr : ToastrService,private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getUserData();
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

  getUserData(){
    this.spinner = true;
    const obj ={
      "id" : this.common.userid
    }
    this.api.postMethod1('users/getUserDetails',obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.profileData = res.response.UserTasksInfo[0].UserInfo[0];
        this.profileUserStatus = res.response.UserTasksInfo[0].UserInfo[0].UserStatus;
        // this.tasks = res.response.UserTasksInfo[0].Task;
        this.spinner = false;
      }
      else{
        this.profileData = '';
        this.spinner = false;
      }
    })
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

  getColor(status: string): string {
    switch (status) {
      case 'Online':
        return '#00ff00';
      case 'Busy':
        return '#ff4545';
      case 'Meeting':
        return '#39d0ff';
      case 'Away':
        return '#eb884b';
      case 'Break':
        return '#fdaa29';
      case 'Offline':
        return '#ff0000';
      case 'Dinner':
        return '#fafafa';
      case 'On Support':
        return '#00ff00';
      default:
        return '#ffffff';
    }
  }

  saveProfileStatus(statusData : any){
    this.spinner = true;
    const obj = {
      "loginfrom": "D",
      "ip": "",
      "typeid": statusData.TYPE_ID,
      "Cust_status": statusData.TYPE_NAME,
      "statusname": statusData.TYPE_NAME,
      "loginUser_id": this.common.userid
    }
    this.api.postMethod1('users/UpdateProfilestatus', obj).subscribe(res => {
      console.log(res);
      if(res.status == 200){
        this.toastr.success('Status updated successfully');
        this.getUserData();
        this.isStatusOpen = false;
        this.profileStatusText = "";
        this.spinner = false;
      }
      else{
        this.toastr.error('Unable to process your request. please try again');
        this.isStatusOpen = false;
        this.profileStatusText = "";
        this.spinner = false;
      }
   
    })
  }
  saveCutomStatus(){
    this.spinner = true;
    const obj = {
      "loginfrom": "D",
      "ip": "",
      "typeid": 1,
      "Cust_status": this.profileStatusText,
      "statusname": this.profileStatusText,
      "loginUser_id": this.common.userid
    }
    this.api.postMethod1('users/UpdateProfilestatus', obj).subscribe(res => {
      console.log(res);
      if(res.status == 200){
        this.toastr.success('Status updated successfully');
        this.getUserData();
        this.isStatusOpen = false;
        this.profileStatusText = "";
        this.spinner = false;
      }
      else{
        this.toastr.error('Unable to process your request. please try again');
        this.isStatusOpen = false;
        this.profileStatusText = "";
        this.spinner = false;
      }
   
    })
  }

  
  getSidebarData() {
    const obj = {
      "ModID":0,
      "expression":"mod_status='Y'",
      "Type":"A",
      "roleid": this.common.roleid,
      "flag": "D"
  }

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
 // Detect click outside menu
  @HostListener('mouseleave', ['$event'])
  closeMenu(event: Event) {
    if (this.menuContainer && !this.menuContainer.nativeElement.contains(event.target)) {
      this.menuList.forEach(menu => menu.isOpen = false);
    }
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

  subMenuClick(item: any){
    item.isOpen = !item.isOpen;

  }

  signOutClick(){
    localStorage.clear();
    this.router.navigateByUrl('')
  }

  openCreateTask(){
     this.modalService.open(CreatetaskComponent, {
            windowClass: 'editModal',
            size: 'xl', 
            backdrop: 'static',
            // centered: true, 
          });
  }

}


