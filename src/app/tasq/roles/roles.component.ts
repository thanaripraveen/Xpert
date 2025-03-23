import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  spinner: boolean = false;
  rolesDataList: any = [];
  status: boolean = true;
  gridForm: boolean = true;
  roleName: any = "";
  roleUniqueId: any = "";
  roleId: any = 0;
  action: any = "A";
  roleData: any = "";
  private modalRef!: NgbModalRef;


  constructor(private api: ApiService, private toastr: ToastrService, private common: common, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.bindRoleData();
  }
  bindRoleData() {
    this.spinner =true;
    const obj = {
      id: '',
      expression: '',
    };
    this.api.postMethod1('users/GetCMSUserRoles', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.rolesDataList = res.response;
        this.spinner = false;
      } else {
        this.rolesDataList = [];
        this.spinner = false;
      }
    });
  }

    allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
   
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  handleStatus(event: any): void {
    this.status = event.target.checked;
  }

  addNewRole() {
    this.gridForm = !this.gridForm;
  }

  editRole(roleData: any) {
    this.spinner =true;
    this.gridForm = !this.gridForm;
    this.action = 'U';
    this.roleName = roleData.Role_Name;
    this.roleUniqueId = roleData.Role_UniqId;
    this.roleId = roleData.Role_Id;
    this.status = roleData.Role_Status == 'Y' ? true : false;
    this.spinner =false;

  }

  deleteRole(modal: any, roleData: any) {
    this.action = 'D';
    this.roleName = roleData.Role_Name;
    this.roleUniqueId = roleData.Role_UniqId;
    this.roleId = roleData.Role_Id;
    this.status = roleData.Role_Status == 'Y' ? true : false;
    this.modalRef = this.modalService.open(modal, {
      windowClass: 'ackConfirmBYModal',
      size: 'sm',
      backdrop: 'static',
    })
  }

  saveAndUpdateRole() {
    this.spinner =true;

    if (this.roleName == '' || this.roleUniqueId == '') {
      this.toastr.warning('please enter role name and unique id')
    }
    else {
      const obj = {
        action: this.action,
        Role_id: this.roleId == 0 ? 0 : this.roleId,
        Role_Name: this.roleName,
        Role_UniqId: this.roleUniqueId,
        Role_active: this.action == 'A' ? 'Y' : this.status == true ? 'Y' : 'N',
        Role_Front: 'N',
        Role_Admin: 'Y',
        Role_Portal: 'N',
      };
      this.api.postMethod1('users/RolesAction', obj).subscribe((res: any) => {
        console.log(res);
        if (res.status == 200 && this.action == 'A') {
          this.toastr.success('Role added successfully');
          this.cancel();
          this.bindRoleData();
          this.spinner =false;

        }
        else if (res.status == 200 && this.action == 'U') {
          this.toastr.success('Role updated successfully');
          this.cancel();
          this.bindRoleData();
          this.spinner =false;


        }
        else if (res.status == 200 && this.action == 'D') {
          this.toastr.success('Role deleted successfully');
          this.action = 'A';
          this.status = true;
          this.roleId = 0;
          this.roleName = "";
          this.roleUniqueId = "";
          this.modalRef.close();
          this.bindRoleData();
          this.spinner =false;

        }
        else {
          this.toastr.error('Unable process your request. please try again.');
          this.cancel();
          this.spinner = false;
        }
      })
    }
  }

  cancel() {
    this.gridForm = !this.gridForm;
    this.action = 'A';
    this.status = true;
    this.roleId = 0;
    this.roleName = "";
    this.roleUniqueId = "";
  }

}
