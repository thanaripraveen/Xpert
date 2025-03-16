import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { common } from '../../common';
import { environment } from '../../../environments/environment';
import moment from 'moment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SavedocumentsComponent } from '../savedocuments/savedocuments.component';
import { CommentsComponent } from '../comments/comments.component';
import { DetailsComponent } from '../details/details.component';
import { EdittaskComponent } from '../edittask/edittask.component';
import { UsersinfoComponent } from '../usersinfo/usersinfo.component';


@Component({
  selector: 'app-alltasks',
  templateUrl: './alltasks.component.html',
  styleUrl: './alltasks.component.scss',

})
export class AlltasksComponent implements OnInit {
  spinner: boolean = false;
  // statusData: any = [
  //   { 'name': 'Open', count: 179 },
  //   { 'name': 'Closed', count: 179 },
  //   { 'name': 'Resolved', count: 179 },
  //   { 'name': 'Un Assigned', count: 179 },
  //   { 'name': 'In Development', count: 179 },
  //   { 'name': 'Testing', count: 179 },
  //   { 'name': 'Ready For Release', count: 179 },
  //   { 'name': 'Un Resolved', count: 179 },
  // ]

  statusData: any = []

  allTasksData: any[] = [];
  alltasks: any = []
  xpertProfileImg: any = environment.xpertProfileImg;
  priorties: any = [
    { id: 3, priorty: 'Low', color: 'green' },
    { id: 2, priorty: 'Medium', color: 'blue' },
    { id: 1, priorty: 'High', color: 'red' },
  ]
  userID: any;
  roleId: any;
  selectedDate: Date = new Date();
  private modalRef!: NgbModalRef;


  // Filter Data

  filterDealer: any = "";
  filterStatus: any = ""
  filterDueDate: any = "";
  filterTags: any = "";
  filterPriority: any = "";
  filterAssignedUser: any = "";
  filterSortBy: any = "";
  filterCreatedBy: any = "";
  filterSearch: any = "";
  filterAssignUserId: any = 0;
  sortValue: any = 'A'
  constructor(private api: ApiService, private fb: FormBuilder, private common: common,
    private router: Router, private toastr: ToastrService, private modalService: NgbModal) {
    this.userID = this.common.userid;
    this.roleId = this.common.roleid;
  }

  ngOnInit(): void {
    this.api.getUserInfoData().subscribe((res: any) => {
      console.log(res);

      if (res) {
        this.filterAssignedUser = res.FirstName + ' ' + res.MiddleName + ' ' + res.LastName;
        this.filterAssignUserId = res.UserId;
        this.bindStatusCounts()

      }
    })
    this.bindDealerData();
    this.bindTagsData();
    this.getAllTickets();
    this.bindStatusCounts()
  }


  getAllTickets() {

    this.spinner = true;

    const obj = {
      "assignid": this.filterAssignUserId == 0 ? 0 : this.filterAssignUserId,
      "duedate": this.filterDueDate == "" || this.filterDueDate == null || this.filterDueDate == undefined || this.filterDueDate == 'Invalid date' ? "" : moment(this.filterDueDate).format('MM/DD/YYYY'),
      "exp": this.filterSearch == "" ? "" : this.filterSearch,
      "exp2": this.filterDealer == "" ? '' : "T_DealerId=" + this.filterDealer,
      "maxId": 0,
      "priority": this.filterPriority == 0 ? 0 : this.filterPriority,
      "stat": this.filterStatus == "" ? "" : this.filterStatus,
      "tagid": this.filterTags == 0 ? 0 : this.filterTags,
      "taskId": 0,
      "userId": this.common.userid,
      "sortby": this.filterSortBy == "" ? "" : this.filterSortBy,
      "orderby": this.sortValue,
      "createdby": this.filterCreatedBy == "" ? "" : this.selectedUser.T_UserEmail
    }
    console.log(obj);

    this.api.postMethod1('xpert/GetAllTasks', obj).subscribe((res: any) => {
      console.log(res);
      if (res.status == 200) {
         const allTasksData = res.response;
        this.alltasks = Array.isArray(allTasksData) ? allTasksData : (allTasksData ? [allTasksData] : []);
        this.alltasks.forEach(item => {
          const taskTags = item?.TaskTagsLists?.TaskTagsLists?.TaskTagsList;
          item.TaskTagsLists.TaskTagsLists.TaskTagsList = Array.isArray(taskTags) ? taskTags : (taskTags ? [taskTags] : []);

          if (item?.Folowers?.Folowers) {
            const followers = item?.Folowers?.Folowers?.Folower;
            item.Folowers.Folowers.Folower = Array.isArray(followers) ? followers : (followers ? [followers] : []);
          }
        this.spinner = false;

        });
      }
      else {
        this.alltasks = [];
        this.spinner = false;
      }
    })
  }

  bindStatusCounts() {
    const obj = {
      "id": this.filterDealer,
      "assignid": this.filterAssignUserId == 0 ? 0 : this.filterAssignUserId,
      "duedate": this.filterDueDate == "" || this.filterDueDate == null || this.filterDueDate == undefined || this.filterDueDate == 'Invalid date' ? "" : moment(this.filterDueDate).format('MM/DD/YYYY'),
      "createdby": this.filterCreatedBy == "" ? "" : this.selectedUser.T_UserEmail,
      "priority": this.filterPriority == 0 ? 0 : this.filterPriority,
      "stat": this.filterStatus == "" ? "" : this.filterStatus,
      "tagid": this.filterTags == 0 ? 0 : this.filterTags
    }
    this.api.postMethod1('xpert/GetTicketcountsbyDealeridV1', obj).subscribe((res: any) => {
      console.log(res);
      if (res.status == 200) {
        this.statusData = res.response;
      }

    })
  }
  countStatusClick(data : any){
    this.filterStatus = data.ID;
    this.getAllTickets();
  }
  filterStatusCountChange() {
    this.bindStatusCounts()
  }

  filterTextChange() {
    if (this.filterSearch == "") {
      this.getAllTickets()
    }
  }


  onSelectChange(event: any, Ticket: any): void {
    const obj = {
      "ticketId": Ticket,
      "priorityid": event.target.value
    }
    this.api.changePriority('xpert/UpdateTicketPriority', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.toastr.success("Priority updated successfully");
        //  this.socketService.sendTask();
      }

    })
  }
  dealersData: any = [];
  tagsData: any = [];
  bindDealerData() {
    const obj = {
      "searchstring": this.filterDealer,
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
  bindTagsData() {
    const obj = {
      "exp": "",
      "userid": this.common.userid
    }
    this.api.postMethod1('xpert/GetSuggestedTagsList', obj).subscribe((res: any) => {
      console.log(res);

      if (res.status == 200) {
        this.tagsData = res.response;
      }
      else {
        this.tagsData = [];
      }
    })
  }

  bindUsersData() {

  }
  bindCreatedUsersData() {

  }

  SortByAscDesc(sortValue: any) {
    this.sortValue = sortValue;
  }

  filterGrid() {
    this.getAllTickets();
  }

  openComponent(task: any, component: any) {

    this.api.setTicketData(task)
    if (component == 'doc') {
      this.modalService.open(SavedocumentsComponent, {
        windowClass: 'documentModal',
        size: 'lg',
        backdrop: 'static',
        centered: true,
      });
    }
    else if (component == 'comments') {
      this.modalService.open(CommentsComponent, {
        windowClass: 'commentsModal',
        size: 'lg',
        backdrop: 'static',
        // centered: true,
      });
    }
    else if (component == 'view') {
      this.modalService.open(DetailsComponent, {
        windowClass: 'viewModal',
        size: 'xl',
        backdrop: 'static',
        centered: true,
      });
    }
    else if (component == 'edit') {
      this.modalService.open(EdittaskComponent, {
        windowClass: 'editModal',
        size: 'xl',
        backdrop: 'static',
        centered: true,
      });
    }
  }

  openUserInfoComponent() {
    this.modalService.open(UsersinfoComponent, {
      windowClass: 'userInfoModal',
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });

  }
  openCreatedByModalPopup: any = "";
  openCreatedByModal(modal: any) {
    this.openCreatedByModalPopup = modal;
    this.bindCreatedUsersList();


  }

  LocalTimeConvertioninHours(DateTime: any) {
    var utcDate = moment.utc(DateTime);
    var dateWithTimezone = utcDate.local().format('MM.DD.YY hh:mm A');
    return dateWithTimezone;

  }
  LocalTimeConvertioninHours1(DateTime: any) {
    var utcDate = moment.utc(DateTime);
    var dateWithTimezone = utcDate.local().format('MM/DD/YY');
    return dateWithTimezone;

  }
  firstLoadForDate = true; // To prevent first automatic trigger
  onDateChange() {
    if (this.firstLoadForDate) {

      this.firstLoadForDate = false; // First trigger ni ignore cheyyadam
      return;
    }
    else{
    this.bindStatusCounts()

    }
  }

  createdUsersList: any = []
  bindCreatedUsersList() {
    this.spinner = true;

    const obj = {
      "dealerid": this.filterDealer == "" ? 0 : this.filterDealer
    }
    this.api.postMethod1('users/GetCreatedUserlist', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.createdUsersList = res.response;
        this.modalRef = this.modalService.open(this.openCreatedByModalPopup, {
          windowClass: 'createdBYModal',
          size: 'lg',
          backdrop: 'static',
          centered: true
        })
        this.spinner = false;

      }
      else {
        this.createdUsersList = [];
        this.modalRef = this.modalService.open(this.openCreatedByModalPopup, {
          windowClass: 'createdBYModal',
          size: 'lg',
          backdrop: 'static',
          centered: true
        })
        this.spinner = false;
      }
    })
  }
  selectedUser: any = null;
  hoveredUser: any = null;

  selectUser(user: any) {
    this.selectedUser = user;
  }

  hoverUser(user: any) {
    this.hoveredUser = user;
  }

  createdUserListFunction(){
    this.filterCreatedBy = this.selectedUser.T_UserName;

    this.bindStatusCounts();
    this.modalRef.dismiss();
    
  }

  clearDueDate(){
    this.filterDueDate = "";
    this.bindStatusCounts();
  }
  clearAssignedby(){
    this.filterAssignedUser = "";
    this.filterAssignUserId = 0;
    this.bindStatusCounts();
  }
  clearCreatedBy(){
    this.filterCreatedBy = "";
    this.bindStatusCounts();
  }

}
