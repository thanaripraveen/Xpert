import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { common } from '../../common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UsersinfoComponent } from '../usersinfo/usersinfo.component';
import * as moment from 'moment';


@Component({
  selector: 'app-edittask',
  templateUrl: './edittask.component.html',
  styleUrl: './edittask.component.scss'
})

export class EdittaskComponent implements OnInit {
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
  spinner : boolean = false;
  priorties = [
    { label: 'Low', value: 3 },
    { label: 'Medium', value: 2 },
    { label: 'High', value: 1 }
  ];
  bindfollowersData : any =[];
  followerLoader : boolean = false;
  taskFollwersFilterList : any =[];
  tagsDataList : any =[];
  tagsLoader : boolean = false;
  AssignUserId: any ="";
  AssignUserName: any ="";
  updateTicketForm : FormGroup | any;
  editTicketData : any = "";
  constructor(private api: ApiService, private toastr: ToastrService, private router: Router, private common: common,
    public activeModal: NgbActiveModal, private modalService: NgbModal, private fb: FormBuilder
  ) {
    this.updateTicketForm = this.fb.group({
      ticketStatus : [''],
      title : [''],
      priority : [''],
      description : [''],
      dueDate : ['']
    })
  }

  ngOnInit(): void {
    this.bindFollowers();
    this.bindTagsDataList();
    this.api.getTicketData().subscribe((res: any)=>{
      this.spinner = true;
      if(res){
        const obj = {
          "TaskId": res.T_ID,
          "UserID": this.common.userid
      }
      this.api.postMethod1('users/GetTaskViewbyId',obj).subscribe((res: any)=>{
        if(res.status == 200){
            this.editTicketData = res.response[0];
            this.updateTicketForm.controls.title.setValue(this.editTicketData.Title);
            this.updateTicketForm.controls.ticketStatus.setValue(this.editTicketData.TaskStatusID)
            this.updateTicketForm.controls.priority.setValue(this.editTicketData.Priority);
            this.updateTicketForm.controls.dueDate.setValue(new Date(this.editTicketData.DueOn));
            this.AssignUserId = this.editTicketData.AssignIdentifier;
            this.AssignUserName = this.editTicketData.AssignUSERNAME;
            let index = this.bindfollowersData.findIndex((element : any)=> element.UserId == this.AssignUserId);
            index != -1 ? this.bindfollowersData.splice(index,1) : '';
            this.setInnerHTML(this.editTicketData.Details);
            
            this.editTicketData.FollowersInfo.forEach((item: any) => {
              let index = this.bindfollowersData.findIndex((element: any) => element.UserId === item.UserId);
            
              if (index !== -1) {
                this.selectedRows.push(this.bindfollowersData[index]);
                this.bindfollowersData.splice(index, 1);
              }
            });

            this.editTicketData.TaskTagsListInfo.forEach((item : any)=>{
              this.tagsDataList.forEach((element : any)=>{
                if(element.tag_id == item.TagIdentifier){
                  let index = this.tagsDataList.findIndex((tagData : any)=> tagData.tag_id == item.TagIdentifier);
                  if(index != -1){
                    this.selectedTagsList.push(this.tagsDataList[index]);
                    this.tagsDataList.splice(index,1)
                  }
                }
              })
            })
            this.spinner = false;
        }
        else{
          this.spinner = false;
        }
      })
      }
    })
    this.api.getUserInfoData().subscribe((res: any) => {
      if (res) {
        this.AssignUserId = res.UserId;
        this.AssignUserName = res.FirstName + ' ' + res.MiddleName + ' ' + res.LastName;
      }
    })
  }

  setInnerHTML(newHTML: string) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newHTML;
    const images: any = tempDiv.getElementsByTagName('img');
    for (let img of images) {
      img.setAttribute('height', '100px');
      img.setAttribute('cursor', 'pointer');
    }
    this.updateTicketForm.controls.description.setValue(tempDiv.innerHTML);

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

  selectedTagsList: any = []
  selectTagClick(tagData: any) {
    this.selectedTagsList.push(tagData);
    this.tagsDataList = this.tagsDataList.filter((item: any) => item.tag_id != tagData.tag_id);
    this.tagsDataList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
    this.selectedTagsList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
  }
  unSelectTagClick(tagData: any) {
    this.tagsDataList.push(tagData);
    this.selectedTagsList = this.selectedTagsList.filter((item: any) => item.tag_id != tagData.tag_id);
    this.tagsDataList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
    this.selectedTagsList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
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

  selectedRows: any = []; // Array to store selected row indexes
  selectFollower(followerData : any) {
    this.selectedRows.push(followerData);
    this.bindfollowersData = this.bindfollowersData.filter((item: any) => item.UserId != followerData.UserId);
    this.bindfollowersData.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
    this.selectedRows.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
  }

  unSelectFollower(followerData : any){
    this.bindfollowersData.push(followerData);
    this.selectedRows = this.selectedRows.filter((item: any) => item.UserId != followerData.UserId);
    this.bindfollowersData.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
    this.selectedRows.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
  }


  isSelected(index: any): boolean {
    return this.selectedRows.includes(index);
  }

  openAssignModal() {
    this.modalService.open(UsersinfoComponent, {
      windowClass: 'userInfoModal',
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
  }

  LocalTimeConvertioninHours(DateTime: any) {
    var utcDate = moment.utc(DateTime);
    var dateWithTimezone = utcDate.local().format('MM.DD.YY hh:mm A');
    return dateWithTimezone;

  }

  clearDate(datepicker: any) {
    this.updateTicketForm.controls.dueDate.setValue('');
    datepicker.hide(); // Hide datepicker
  }

  clearAssignedData(){
    this.AssignUserId = "";
    this.AssignUserName = "";
  }

  closeModal() {
    this.activeModal.close();
  }
}
