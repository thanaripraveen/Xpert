import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { common } from '../../common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup , Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UsersinfoComponent } from '../usersinfo/usersinfo.component';
import * as moment from 'moment';
import { Subscription } from 'rxjs';


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
  spinner: boolean = false;
  priorties = [
    { label: 'Low', value: 3 },
    { label: 'Medium', value: 2 },
    { label: 'High', value: 1 }
  ];
  bindfollowersData: any = [];
  followerLoader: boolean = false;
  taskFollwersFilterList: any = [];
  tagsDataList: any = [];
  tagsLoader: boolean = false;
  AssignUserId: any = "";
  AssignUserName: any = "";
  updateTicketForm: FormGroup | any;
  editTicketData: any = "";
  commentsArray: any = [];
  userID: any = "";
  publicStatus: boolean = true;
    private subscription: Subscription = new Subscription();
  
  constructor(private api: ApiService, private toastr: ToastrService, private router: Router, private common: common,
    public activeModal: NgbActiveModal, private modalService: NgbModal, private fb: FormBuilder
  ) {
    this.updateTicketForm = this.fb.group({
      ticketStatus: [''],
      title: ['',[Validators.required]],
      priority: [''],
      description: ['',[Validators.required]],
      dueDate: ['']
    })

    this.userID = this.common.userid;
  }

  ngOnInit(): void {
    this.bindFollowers();
    this.bindTagsDataList();
  this.subscription =  this.api.getTicketData().subscribe((res: any) => {
      this.spinner = true;
      if (res) {
        const obj = {
          "TaskId": res.T_ID,
          "UserID": this.common.userid
        }
        this.api.postMethod1('users/GetTaskViewbyId', obj).subscribe((res: any) => {
          if (res.status == 200) {
            this.editTicketData = res.response[0];
            this.getComments();
            this.updateTicketForm.controls.title.setValue(this.editTicketData.Title);
            this.updateTicketForm.controls.ticketStatus.setValue(this.editTicketData.TaskStatusID)
            this.updateTicketForm.controls.priority.setValue(this.editTicketData.Priority);
            this.updateTicketForm.controls.dueDate.setValue(new Date(this.editTicketData.DueOn));
            this.AssignUserId = this.editTicketData.AssignIdentifier;
            this.AssignUserName = this.editTicketData.AssignUSERNAME;
            let index = this.bindfollowersData.findIndex((element: any) => element.UserId == this.AssignUserId);
            index != -1 ? this.bindfollowersData.splice(index, 1) : '';
            this.setInnerHTML(this.editTicketData.Details);

            this.editTicketData.FollowersInfo.forEach((item: any) => {
              let index = this.bindfollowersData.findIndex((element: any) => element.UserId === item.UserId);

              if (index !== -1) {
                this.selectedRows.push(this.bindfollowersData[index]);
                this.bindfollowersData.splice(index, 1);
              }
            });

            this.editTicketData.TaskTagsListInfo.forEach((item: any) => {
              this.tagsDataList.forEach((element: any) => {
                if (element.tag_id == item.TagIdentifier) {
                  let index = this.tagsDataList.findIndex((tagData: any) => tagData.tag_id == item.TagIdentifier);
                  if (index != -1) {
                    this.selectedTagsList.push(this.tagsDataList[index]);
                    this.tagsDataList.splice(index, 1)
                  }
                }
              })
            })
            this.spinner = false;
          }
          else {
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
  
  ngOnDestroy(){
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.api.setTicketData('');
    }
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
  selectFollower(followerData: any) {
    this.selectedRows.push(followerData);
    this.bindfollowersData = this.bindfollowersData.filter((item: any) => item.UserId != followerData.UserId);
    this.bindfollowersData.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
    this.selectedRows.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
  }

  unSelectFollower(followerData: any) {
    this.bindfollowersData.push(followerData);
    this.selectedRows = this.selectedRows.filter((item: any) => item.UserId != followerData.UserId);
    this.bindfollowersData.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
    this.selectedRows.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
  }

  getComments() {
    const obj = {
      "ticket": this.editTicketData.Ticket,
      "userid": this.common.userid,
      "id": 1
    }
    this.api.postMethod1('xpert/GetTaskComments', obj).subscribe((res: any) => {
      if (res.status == 200 && res.response.length > 0) {
        this.commentsArray = res.response.filter((item: any) => item.commentStatus != 'D');
        this.spinner = false;
      } else {
        this.commentsArray = [];
        this.spinner = false;
      }
    });
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
  submitted : boolean = false;
  selectedFollowerIds : any =[];
  selectedTagsIds : any =[];
  sendMailStatus : boolean = false;

  updateTicket() {
    this.spinner =true;
    if (this.updateTicketForm.invalid) {
      this.submitted = true;
      this.spinner = false;
    }
    else {
      for (let i = 0; i < this.selectedTagsList.length; i++) {
        this.selectedTagsIds.push(this.selectedTagsList[i].tag_id)
      }
      for (let i = 0; i < this.selectedRows.length; i++) {
        this.selectedFollowerIds.push(this.selectedRows[i].UserId)
      }
      const obj = {
        'Action': 'U',
        'Id': this.editTicketData.ID,
        'CreatedAdmId': this.common.userid,
        'Title': this.updateTicketForm.controls.title.value,
        'Description': this.updateTicketForm.controls.description.value,
        'Tags': this.selectedTagsIds.join(","),
        'ASTU_Id': this.AssignUserId == "" ? 0 : this.AssignUserId,
        'AckStatusTypeId': this.updateTicketForm.controls.ticketStatus.value,
        'DealerId': this.editTicketData.ReqDealerId,
        'DueDate': this.updateTicketForm.controls.dueDate.value.toISOString(),
        'FollowersIds': this.selectedFollowerIds.join(","),
        'priority': this.updateTicketForm.controls.priority.value,
        'status': 'Y',
        'Loginfrom': 'D',
        'ParentId': '0',
        'TitleIds': '',
        'tasktype': 0,
        'taskfrom': this.editTicketData.ReqSource,
        'mailid': this.editTicketData.ReqUserEmail.trim(),
        'sendMailStatus': this.sendMailStatus == true ? 'Y' : 'N'
      }
      this.api.postMethod1('xpert/CreateAppSupportTask', obj).subscribe((res: any) => {
        if (res.status == 200) {
         
            this.submitted = false;
            this.updateTicketForm.reset();
            this.spinner = false;
            this.activeModal.close();
            this.toastr.success('Ticket details updated successfully');
            
            const obj = {
              "TaskId": localStorage.getItem('ID'), "UserID": this.common.userid
            }
            this.api.postMethod1('users/GetTaskViewbyId', obj).subscribe((res: any) => {
              if (res) {
             this.api.setUpdateTaskValue({data : res , updateValue : 1})
              }
            });
            // this.socketService.sendTask();
            //  this.router.navigate(['dashboard']);
            // this.router.navigate([this.redirectRouteUrl]);
        }
        else {
          this.submitted = false;
          this.updateTicketForm.reset();
          this.spinner = false;
          this.activeModal.close();
          this.toastr.error('Unable to process your request, please try again..');
          // this.router.navigate([this.redirectRouteUrl]);
        }
      })
    }
  }
commentId : any =0;
sendcmtMailStatus : any ="";
commentDescription : any =""
  editComment(commentData : any){
    this.commentId = commentData.Id;
    this.publicStatus = commentData.publicStatus == 'Y' ? true : false;
    this.sendcmtMailStatus = false;
     this.commentDescription = commentData.commentEditDesc;
    
  }

  clearDate(datepicker: any) {
    this.updateTicketForm.controls.dueDate.setValue('');
    datepicker.hide(); // Hide datepicker
  }

  clearAssignedData() {
    this.AssignUserId = "";
    this.AssignUserName = "";
  }

  closeModal() {
    this.activeModal.close();
  }
}
