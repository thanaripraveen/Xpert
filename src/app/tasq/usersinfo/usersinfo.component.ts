import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-usersinfo',
  templateUrl: './usersinfo.component.html',
  styleUrl: './usersinfo.component.scss'
})
export class UsersinfoComponent implements OnInit {
  spinner: boolean = false;

  ddlDeptSelect: any = 0;
  txtsearch : any ="";

  departmentData: any = [];
  usersInfoList : any =[];
  xpertProfileImg =environment.xpertProfileImg;

  constructor(private activeModal: NgbActiveModal, private api: ApiService, private common: common) { }

  ngOnInit(): void {

    this.bindDepartments();
    this.bindUsersInfo('', 0)

  }
  bindDepartments() {
    this.spinner = true;
    const obj = {
      "roleid": 100,
      "userid": this.common.userid,
      "tagname": "",
      "tagtype": "D"
    }
    this.api.postMethod1('users/GetDepartments', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.departmentData = res.response;
        this.spinner = false;
      }
      else{
        this.departmentData = [];
        this.spinner = false;
      }
    })
  }

  bindUsersInfo(exp: any,taglist : any){
    this.spinner = true;
    const obj =
    {
      "id": 0,
      "expression": exp,
      "type": "F",
      "DeptTag": taglist
    }
    this.api.postMethod1('users/GetfollowersData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.usersInfoList = res.response;
        this.spinner = false;
      }
      else{
        this.usersInfoList = [];
        this.spinner = false;

      }
    })
  }

  deptSelect(){
    let exp = `(u_first_name like '${this.txtsearch}%' or u_last_name like '${this.txtsearch}%')`;
    this.bindUsersInfo(exp,this.ddlDeptSelect)

  }
  SearchByName(){
    let exp = `(u_first_name like '${this.txtsearch}%' or u_last_name like '${this.txtsearch}%')`;
    this.bindUsersInfo(exp,this.ddlDeptSelect);

  }

  selectUserAndCheck(userData: any, radioButton: HTMLInputElement) {
    this.selectUser(userData);
    radioButton.checked = true;
  }
  userInformation : any ="";
  selectUser(data: any){
    this.userInformation = data;
  }
  userSubmitClick(){
    this.api.setUserInfoData(this.userInformation);
    this.activeModal.close();
  }
  closeModal() {
    this.activeModal.close();
  }
}
