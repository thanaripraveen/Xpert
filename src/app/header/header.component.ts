import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { common } from '../common';
import { ApiService } from '../providers/api.service';
import { Router } from '@angular/router';
// import { Config } from '../../app/types/Config'
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  // Side Bar variables
  submodules : any = [];
  menuList : any =[];
 
  // For Binding Profile Date
  profileData : any;

  // Image Url
  imageUrl = environment.imgUrl;

  @ViewChild('closeOffcanvas') closeOffcanvas: ElementRef | undefined;
constructor(public common: common,private api: ApiService,private router : Router){
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

}

// SideBar function
getSidebarData() {
  this.submodules = []
  const obj = {
    "roleid": this.common.roleid,
    "flag": "D"
  }
  this.api.getSidebarListService('Permissions/getModules', obj).subscribe((response: any) => {
    if (response.StatusCode == 200) {
      const mainModules = response.menulist.filter((item: any) => item.ModParentId === 0 && item.StatusType === 'Y');
      this.menuList = mainModules.map((mainModule: any) => ({
        Identifier: mainModule.Identifier,
        ModSequence: mainModule.ModSequence,
        UID: mainModule.UID,
        ModuleName: mainModule.ModuleName,
        FileName: mainModule.FileName,
        Status: mainModule.Status,
        ModParentId: mainModule.ModParentId,
        ModType: mainModule.ModType,
        StatusType: mainModule.StatusType,
        platform: mainModule.platform,
        Component: mainModule.Component,
        ShowComponent: mainModule.ShowComponent,
        compstats: mainModule.compstats,
        active: false,
        submenu: response.menulist.filter((subModule: any) => mainModule.Identifier === subModule.ModParentId && subModule.StatusType === 'Y')
          .map((subModule: any) => ({
            Identifier: subModule.Identifier,
            ModSequence: subModule.ModSequence,
            UID: subModule.UID,
            SubModuleName: subModule.ModuleName,
            FileName: subModule.FileName,
            Status: subModule.Status,
            ModParentId: subModule.ModParentId,
            ModType: subModule.ModType,
            StatusType: subModule.StatusType,
            platform: subModule.platform,
            Component: subModule.Component,
            ShowComponent: subModule.ShowComponent,
            compstats: subModule.compstats,
          }))

      }));
    }

  })
}

toggle(index: any) {
console.log(index);

  // if (!this.config.multi) {
    this.menuList.filter(
      ((menu: any, i: any) => i !== index && menu.active
      )).forEach((menu: any) => menu.active = !menu.active);
  // }
  this.menuList[index].active = !this.menuList[index].active;


}

submenuClick(url: any) {
  this.router.navigateByUrl(url);
  this.closeOffcanvas?.nativeElement.click()
}


closeSideNav(e: any) {
  if (e.target.className.slice(0, 19) !== 'navbar-toggler-icon') {
    this.closeOffcanvas?.nativeElement.click()
  }
}
}
