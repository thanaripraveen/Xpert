import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent implements OnInit {
spinner : boolean = false;
bindRolesList: any = [];
bindModulesList: any = [];
parentModulesList: any = [];
childModulesList: any = [];
selectedRoleId: any = "";
isLoading: boolean = false;
constructor(private api: ApiService, private common: common, private router: Router, private toastr: ToastrService) { }

ngOnInit(): void {
  this.bindRoles();
  this.bindModules()
}
bindRoles() {
  this.isLoading = true;
  this.api.bindRoles('Permissions/BindRole?type=', 'A').subscribe((res: any) => {
    if (res.length > 0) {
      this.bindRolesList = res.filter((itm: any) => itm.UId != 0);
      this.isLoading = false;
    }
    else {
      this.bindRolesList = [];
      this.isLoading = false;

    }
  })
}

bindModules() {
  this.isLoading = true;

  const obj = {
    "roleid": this.common.roleid, "flag": "D"
  }
  this.api.postmethod('Permissions/BindModules', obj).subscribe((res: any) => {
    if (res.StatusCode == "200") {
      this.bindModulesList = res.menulist.map(item => {
        if (item.StatusType !== 'N') {
          item.StatusType = 'N';
        }
        return item;
      });;
      this.parentModulesList = this.bindModulesList.filter((item: any) => item.ModParentId == 0);
      this.childModulesList = this.bindModulesList.filter((item: any) => item.ModParentId != 0);
      this.isLoading = false;
    }
    else {
      this.bindModulesList = [];
      this.parentModulesList = [];
      this.childModulesList = [];
      this.isLoading = false;

    }
  })
}

getModules(e: any) {
  this.isLoading = true;

  if (e.target.value != "") {
    const obj =
      { "id": 0, "roleid": e.target.value, "modtype": "", "flag": "D" }

    this.api.postmethod('Permissions/getModules', obj).subscribe((res: any) => {
      if (res.StatusCode == 200) {
        this.parentModulesList = res.menulist.filter((item: any) => item.ModParentId == 0);
        this.childModulesList = res.menulist.filter((item: any) => item.ModParentId != 0);
        this.isLoading = false;
      }
      else {
        this.isLoading = false;
      }
    })
  }
  else {
    this.bindModules();
  }

}

parentCheckValue(e: any, pobj: any) {
  this.isLoading = true;

  if (e.target.checked) {
    this.parentModulesList.forEach((item: any) => {
      if (item.Identifier == pobj.Identifier) {
        item.StatusType = 'Y';

        this.childModulesList.forEach((element: any) => {
          if (item.Identifier == element.ModParentId) {
            element.StatusType = 'Y';
          }
        })
      }
    })
  }
  else if (e.target.checked == false) {
    this.parentModulesList.forEach((item: any) => {
      if (item.Identifier == pobj.Identifier) {
        item.StatusType = 'N'
        this.childModulesList.forEach((element: any) => {
          if (item.Identifier == element.ModParentId) {
            element.StatusType = 'N';
          }
        })
      }
    })
  }
  this.isLoading = false;

}

childCheckValue(e: any, cobj: any) {
  this.isLoading = true;

  if (e.target.checked) {
    this.childModulesList.forEach((item: any) => {
      if (item.Identifier == cobj.Identifier) {
        item.StatusType = 'Y';
        this.parentModulesList.forEach((element: any) => {
          if (item.ModParentId == element.Identifier) {
            element.StatusType = 'Y';
          }
        })
      }
    })
  }
  else if (e.target.checked == false) {
    this.childModulesList.forEach((item: any) => {
      if (item.Identifier == cobj.Identifier) {
        item.StatusType = 'N';
        this.parentModulesList.forEach((element: any, i: any) => {
          if (element.Identifier == cobj.ModParentId) {
            let checkData = this.childModulesList.find((itm: any) => itm.ModParentId == element.Identifier && itm.StatusType != 'N');
            if (checkData != undefined) {
              element.StatusType = 'Y'
            }
            else {
              element.StatusType = 'N';
            }
          }
        })

      }
    })
  }
  this.isLoading = false;

}

savePermissions() {
  this.isLoading = true;

  if (this.selectedRoleId == "") {
    this.toastr.warning("Select Module/Role");
    this.bindModules()

  }
  else {
    let pdata: any = [];
    let cdata: any = []
    this.parentModulesList.forEach((e: any) => {
      if (e.StatusType == 'Y') {
        pdata.push(e.Identifier + '_' + ',');
      }
    })
    this.childModulesList.forEach((e: any) => {
      if (e.StatusType == 'Y') {
        cdata.push(e.Identifier);
      }
    })
    let modids = pdata.join('_' + ',') + cdata.join('_ ' + ',') + '_ ' + ','
    let obj = {
      "modids": modids,
      "roleid": this.selectedRoleId,
      "modtype": "A",
      "userid": this.common.userid
    }
    this.api.postmethod('Permissions/Save', obj).subscribe((res: any) => {
      if (res.Statuscode == 200 && res.num == 1) {
        this.isLoading = false;
        this.toastr.success("Permissions saved successfully");
        this.bindModules();
        this.selectedRoleId = "";
        this.router.navigateByUrl('dashboard')
      }
      else {
        this.isLoading = false;
        this.toastr.error('Unable to process your request.Please try again');
        this.bindModules();
        this.selectedRoleId = "";
        this.router.navigateByUrl('dashboard')
      }
    })
  }
}
cancel() {
  this.router.navigateByUrl('dashboard')
}

}
