import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-userstatus',
  templateUrl: './userstatus.component.html',
  styleUrl: './userstatus.component.scss'
})
export class UserstatusComponent implements OnInit {
  spinner: boolean = false;
  gridForm: boolean = true;
  action: any = 'A';
  userStatusDataList: any = [];
  userStatusName: any = "";
  sequence: any = "";
  color: any = "#000000";
  status: boolean = true;
  private modalRef!: NgbModalRef;

  constructor(private api: ApiService, private toastr: ToastrService, private common: common, private modalService: NgbModal) { }
  ngOnInit(): void {
    this.bindUserStatusData();
  }

  bindUserStatusData() {
    this.spinner = true;
    const obj = {
      exp: ''
    };
    this.api.postMethod1('users/GetUserStatusType', obj).subscribe((res: any) => {
      console.log(res);
      if (res.status == 200) {
        this.userStatusDataList = res.response;
        this.spinner = false;
      }
      else {
        this.userStatusDataList = [];
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
  addNewRole() {
    this.gridForm = !this.gridForm;
  }

  handleStatus(e: any) {
    this.status = e.target.checked;
  }

  editUserStatus(userStatusData: any) {
    this.spinner =true;
    this.gridForm = !this.gridForm;
    this.action = 'U';
    this.userStatusName = userStatusData.TYPE_NAME;
    this.sequence = userStatusData.type_sequence;
    this.status = userStatusData.type_status == 'Y' ? true : false;
    this.color = userStatusData.TYPE_COLOR;
    this.spinner =false;


  }

  deleteUserStatus(modal: any, userStatusData: any) {
    this.action = 'D';
    this.userStatusName = userStatusData.TYPE_NAME;
    this.sequence = userStatusData.type_sequence;
    this.status = userStatusData.type_status == 'Y' ? true : false;
    this.color = userStatusData.TYPE_COLOR;

    this.modalRef = this.modalService.open(modal, {
      windowClass: 'ackConfirmBYModal',
      size: 'sm',
      backdrop: 'static',
    })
  }

  saveAndUpdateUserStatus() {
    this.spinner =true;
    if (this.userStatusName == "" || this.sequence == "") {
      this.toastr.warning("All fields are mandatory");
    }
    else {
      const obj = {
        action: this.action,
        name: this.userStatusName,
        status: this.status == true ? 'Y' : 'N',
        sequence: this.sequence,
        userid: this.common.userid,
        color: this.color
      }
      this.api.postMethod1('users/UserStatusAction', obj).subscribe((res: any) => {

        if (res.status == 200 && this.action == 'A') {
          this.toastr.success('User status added successfully');
          this.cancel();
          this.bindUserStatusData();
          this.spinner =false;
        }
        else if (res.status == 200 && this.action == 'U') {
          this.toastr.success('User status updated successfully');
          this.cancel();
          this.bindUserStatusData();
          this.spinner =false;

        }
        else if (res.status == 200 && this.action == 'D') {
          this.toastr.success('User status deleted successfully');
          this.action = 'A';
          this.userStatusName = "";
          this.sequence = "";
          this.status = true;
          this.modalRef.close();
          this.bindUserStatusData();
          this.spinner =false;


        }
        else {
          this.toastr.warning('Unable to process your request. please try again.');
          this.cancel();
          this.spinner =false;

        }

      })
    }
  }
  cancel() {
    this.gridForm = !this.gridForm;
    this.action = 'A';
    this.userStatusName = "";
    this.sequence = "";
    this.status = true;
  }
}
