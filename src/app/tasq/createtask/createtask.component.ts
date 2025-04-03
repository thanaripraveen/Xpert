import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { common } from '../../common';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UsersinfoComponent } from '../usersinfo/usersinfo.component';


@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrl: './createtask.component.scss'
})
export class CreatetaskComponent implements OnInit {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultFontName: 'Arial',
    defaultFontSize: '3px',
    toolbarPosition: 'top', // Options: 'top' or 'bottom'
    defaultParagraphSeparator: 'p',
    sanitize: false
  };

  tagsDataList: any = []
  dealer: any = "";

  followerLoader: boolean = false;
  bindfollowersData: any = [];
  taskFollwersFilterList : any =[];
  movedRows: any = [];
  tagsLoader: boolean = false;

  AssignUserData : any ="";
  spinner: boolean = false;
  constructor(private api: ApiService, private toastr: ToastrService, private router: Router, private common: common,
    public activeModal: NgbActiveModal, private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.bindTagsDataList();
    this.bindDealerData();
    this.bindFollowers();
    this.api.getUserInfoData().subscribe((res: any)=>{
      if(res){
        this.AssignUserData = res;
      }
    })
  }
  dealersData: any = [];
  bindDealerData() {
    const obj = {
      "searchstring": this.dealer,
      "userId": this.common.userid
    }
    this.api.postMethod1('users/GetAutoCompleteDealersData', obj).subscribe((res: any) => {
      console.log(res);

      if (res.status == 200) {
        this.dealersData = res.response;
      }
      else {
        this.dealersData = [];
      }
    })
  }
  bindTagsDataList() {
    this.tagsLoader = true;
    const obj = {
      "exp": 0,
      "userid": this.common.userid
    }
    this.api.postMethod1('xpert/GetSuggestedTagsList', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.tagsDataList = res.response;
        this.tagsLoader = false;
      }
      else {
        this.tagsDataList = [];
        this.tagsLoader = false;

      }
    })
  }

  bindFollowers() {
    this.followerLoader = true;
    const obj = {
      "ID": 0,
      "type": "F",
      "DeptTag": 0,
      "expression": 'u_uid not in (' + this.common.userid + ')'
    }
    this.api.postMethod1('users/GetfollowersData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.bindfollowersData = res.response;
        this.taskFollwersFilterList = res.response;
        this.followerLoader = false;
      }
      else {
        this.bindfollowersData = [];
        this.followerLoader = false;
      }
    })
  }
  searchFollowerName(e: any) {
    this.bindfollowersData = this.taskFollwersFilterList.filter(element =>
      element.FirstName.toLowerCase().includes(e.target.value.toLowerCase()) || element.MiddleName.toLowerCase().includes(e.target.value.toLowerCase()) ||
      element.LastName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    this.bindfollowersData = this.bindfollowersData.filter((e: any) => !this.movedRows.some((item: any)=> e.UserId == item.UserId));
  }

  selectedRows: any = []; // Array to store selected row indexes

  selectRow(indexData: any) {
    const selectedIndex = this.selectedRows.indexOf(indexData);
    if (selectedIndex === -1) {
      this.selectedRows.push(indexData);
    } else {
      this.selectedRows.splice(selectedIndex, 1);
    }
  }
  doubleClick(fData: any, fromValue: any) {
    this.selectedRows.push(fData);
   this.moveSelectedRows(fromValue);
  }
  isSelected(index: any): boolean {
    return this.selectedRows.includes(index);
  }
  moveSelectedRows(fromvalue : any) {
    if (this.selectedRows.length > 0) {
      if(fromvalue == 1){
        this.selectedRows.forEach(selectedItem => {
          const index = this.bindfollowersData.findIndex(item => item.UserId == selectedItem.UserId);
          if (index !== -1) {
            this.bindfollowersData.splice(index, 1); // Remove item from firstArray
          }
        });
        for (let i = 0; i < this.selectedRows.length; i++) {
          this.movedRows.push(this.selectedRows[i]);
        }
        this.movedRows = [...new Set(this.movedRows)];
        this.movedRows.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
        this.selectedRows = []
      }
      else{
        this.selectedRows.forEach(selectedItem => {
          const index = this.movedRows.findIndex(item => item.UserId == selectedItem.UserId);
          if (index !== -1) {
            this.movedRows.splice(index, 1); // Remove item from firstArray
          }
        });
        for (let i = 0; i < this.selectedRows.length; i++) {
          this.bindfollowersData.push(this.selectedRows[i]);
        }
        this.bindfollowersData = [...new Set(this.bindfollowersData)];
        this.bindfollowersData.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
        this.selectedRows = []
      }
    }
    else {
      this.toastr.warning('Select user from followers list')
    }
  }

  selectedTagsList : any =[]
  selectTagClick(tagData : any){
    this.selectedTagsList.push(tagData);
   this.tagsDataList = this.tagsDataList.filter((item: any)=>item.tag_id != tagData.tag_id);
   this.tagsDataList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
   this.selectedTagsList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));

  }
  unSelectTagClick(tagData : any){
    this.tagsDataList.push(tagData);
    this.selectedTagsList = this.selectedTagsList.filter((item: any)=>item.tag_id != tagData.tag_id);
    this.tagsDataList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
   this.selectedTagsList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
  }

  openAssignModal(){
    this.modalService.open(UsersinfoComponent, {
      windowClass: 'userInfoModal',
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
  }
  closeModal() {
    this.activeModal.close();
  }

}
