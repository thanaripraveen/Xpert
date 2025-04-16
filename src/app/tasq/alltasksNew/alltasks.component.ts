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
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-alltasks',
  templateUrl: './alltasks.component.html',
  styleUrl: './alltasks.component.scss',

})
export class AlltasksComponent implements OnInit {
  spinner: boolean = false;
  list=true;
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
  alltasks: any = [];
  dataCount: any = 0;
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
  filterByManager : number = 0;
  sortValue: any = 'A';
  fromType: any = "";
  private subscription: Subscription = new Subscription();
  private allClientSubscription: Subscription = new Subscription();

  keyNamesList: any = [
    { keyname: 'Ticket', value: 'Ticket' },
    { keyname: 'Dealer Name', value: 'ReqDealerName' },
    { keyname: 'Title', value: 'Title' },
    { keyname: 'Priority', value: 'T_Priority' },
    // {keyname : 'Acknowledged By' , value : 'AckUSERNAME'},
    { keyname: 'Assign By', value: 'AssignByUserName' },
    { keyname: 'Assign To', value: 'AssignUSERNAME' },
    { keyname: 'Resloved By', value: 'Reslovedby' },
    { keyname: 'Created By', value: 'ReqUserName' },
    { keyname: 'Status', value: 'ReqStatus' },
    { keyname: 'Due Date', value: 'DueDate' },
    { keyname: 'Description', value: 'Details' },

  ]

  hoveredRowIndex: number | null = null;

  constructor(private api: ApiService, private fb: FormBuilder, private common: common,
    private router: Router, private toastr: ToastrService, private modalService: NgbModal) {
    this.userID = this.common.userid;
    this.roleId = this.common.roleid;
  }

  ngOnInit(): void {
    this.spinner = true;
    this.api.getShowHideToggleDiv().subscribe((res: any)=>{
      this.list = res;
    })

    this.bindDealerData();
    this.bindCreatedUsersList();
    this.bindUsersInfo();
    this.bindManagers();

   

    this.api.getUpdateTaskValue().subscribe((res: any)=>{
      console.log(res);
      if(res.updateValue == 1){
        //console.log(this.allTicketsData);
        const index = this.allTicketsData.findIndex((item : any) => item.T_ID == res.data.response[0].ID);
        console.log(index);
        if (index !== -1) {
          this.allTicketsData[index] = res.data.response[0];
        }
      }
      else{
        this.subscription = this.api.getFilterStatusBasedData().subscribe((res: any) => {
          //console.log(res);
    
          this.allTicketsData = [];
          if (res.status != '' && res.dealerId != '' && res.tktStatus == '') {
            this.filterStatus = res.status;
            this.filterDealer = res.dealerId;
            this.fromType = "dashboard";
            this.filterStatusCountChange();
            this.filterGrid();
          }
          else if (res.status == '' && res.dealerId != '' && res.tktStatus == '') {
            this.filterDealer = res.dealerId;
            this.filterStatusCountChange();
            this.filterGrid();
          }
          else if (res.status == '' && res.dealerId == '' && res.tktStatus != '') {
            this.countStatusClick(res.tktStatus)
          }
          else {
            this.allClientSubscription = this.api.getClientsAndDealersData().subscribe((res: any) => {
              //console.log(res);
    
              this.allTicketsData = [];
              if (res.clientId != '' && res.dealerId == '') {
                this.filterAssignUserId = res.clientId;
                this.filterAssignedUser = res.clientId;
                this.bindStatusCounts();
                this.getAllTickets();
              }
              else if (res.clientId != '' && res.dealerId != '') {
                this.filterAssignUserId = res.clientId;
                this.filterAssignedUser = res.clientId;
                this.filterDealer = res.dealerId;
                this.filterStatusCountChange();
                this.getAllTickets();
              }
              else {
                this.getAllTickets();
                this.bindStatusCounts();
                this.bindTagsData();
    
              }
            })
    
          }
    
        });
      }
    })

    // this.getAllTickets();
    // this.bindStatusCounts()
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.api.setFilterStatusBasedData({ 'status': '', 'dealerId': '', 'tktStatus': '' });


    }
    if (this.allClientSubscription) {
      this.allClientSubscription.unsubscribe();
      this.api.setClientsAndDealersData({ 'clientId': '', 'name': '', 'dealerId': '' });

    }
  }

  totalPages: any;
  getAllTickets() {

    this.spinner = true;

    const obj = {
      "assignid": this.filterAssignedUser == 0 ? 0 : this.filterAssignedUser,
      "duedate": this.filterDueDate == "" || this.filterDueDate == null || this.filterDueDate == undefined || this.filterDueDate == 'Invalid date' ? "" : moment(this.filterDueDate).format('MM/DD/YYYY'),
      "exp": this.filterSearch == "" ? "" : this.filterSearch,
      "exp2": this.filterDealer == "" ? '' : "T_DealerId=" + this.filterDealer,
      "maxId": this.rowCount,
      "priority": this.filterPriority == 0 ? 0 : this.filterPriority,
      "stat": this.filterStatus == "" ? "" : this.filterStatus,
      "tagid": this.filterTags == 0 ? '' : this.filterTags,
      "taskId": 0,
      "userId": this.common.userid,
      "sortby": this.filterSortBy == "" ? '' : this.filterSortBy,
      "orderby": this.sortValue,
      "createdby": this.filterCreatedBy == "" ? "" : this.filterCreatedBy,
      'managerid' : this.filterByManager || 0
    }

    this.api.postMethod1('xpert/GetAllTasks', obj).subscribe((res: any) => {

      if (res.status == 200) {
        this.dataCount = res.response.count;
        this.totalPages = Math.ceil(this.dataCount / 20);
        this.allTasksData = Array.isArray(res.response.data) ? res.response.data : (res.response.data ? [res.response.data] : []);
        console.log(this.allTasksData);
        this.alltasks = []
        if (this.alltasks.length) {
          this.alltasks = [...this.alltasks, ...this.allTasksData]
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
          this.alltasks = this.allTasksData;
          this.alltasks.forEach(item => {
            if (item?.TaskTagsLists?.TaskTagsLists) {
              const taskTags = item?.TaskTagsLists?.TaskTagsLists?.TaskTagsList;
              item.TaskTagsLists.TaskTagsLists.TaskTagsList = Array.isArray(taskTags) ? taskTags : (taskTags ? [taskTags] : []);

            }

            if (item?.Folowers?.Folowers) {
              const followers = item?.Folowers?.Folowers?.Folower;
              item.Folowers.Folowers.Folower = Array.isArray(followers) ? followers : (followers ? [followers] : []);
            }


            this.spinner = false;

          });
        }

        this.updateTaskList();

      }
      else {
        this.alltasks = [];
        this.updateTaskList()
        this.spinner = false;
      }
    })
  }
  currentPage: any = 1;
  allTicketsData: any = []
  updateTaskList() {
    let startIndex = (this.currentPage - 1) * 20;
    let endIndex = this.currentPage * 20;
    if (startIndex >= this.alltasks.length) {
      startIndex = Math.max(0, this.alltasks.length - 20);
    }

    this.allTicketsData = this.alltasks.slice(startIndex, endIndex);

    //console.log(this.allTicketsData);


  }

  goToFirstPage() {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.rowCount = 0;
      this.alltasks = []
      this.getAllTickets();
    }
  }
  rowCount: any = 0;
  goToLastPage() {
    if (this.currentPage !== this.totalPages) {
      this.currentPage = this.totalPages;
      this.rowCount = this.dataCount - 20;
      this.alltasks = [];
      this.getAllTickets();

    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.rowCount = (this.currentPage - 1) * 20;
      //console.log(this.alltasks);

      if (this.rowCount < this.alltasks.length) {

        this.updateTaskList();
      } else {

        this.getAllTickets()
      }
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.rowCount = (this.currentPage - 1) * 20;

      if (this.rowCount >= this.alltasks.length) {
        this.getAllTickets()
      } else {

        this.updateTaskList();
      }
    }
  }

  bindStatusCounts() {
    const obj = {
      "id": this.filterDealer || 0,
      "assignid": this.filterAssignedUser == 0 ? 0 : this.filterAssignedUser,
      "duedate": this.filterDueDate == "" || this.filterDueDate == null || this.filterDueDate == undefined || this.filterDueDate == 'Invalid date' ? "" : moment(this.filterDueDate).format('MM/DD/YYYY'),
      "createdby": this.filterCreatedBy == "" ? "" : this.filterCreatedBy,
      "priority": this.filterPriority == 0 ? 0 : this.filterPriority,
      "stat": this.filterStatus == "" ? "" : this.filterStatus,
      "tagid": this.filterTags == 0 ? 0 : this.filterTags,
      "managerid" : this.filterByManager || 0
    }
    this.api.postMethod1('xpert/GetTicketcountsbyDealeridV1', obj).subscribe((res: any) => {
      //console.log(res);
      if (res.status == 200) {
        this.statusData = res.response;
      }

    })
  }
  countStatusClick(data: any) {
    this.allTicketsData = [];
    this.alltasks = [];
    this.rowCount = 0;
    this.filterStatus = data;
    this.getAllTickets();
  }
  filterStatusCountChange() {
    this.bindStatusCounts();
    this.bindCreatedUsersList();
  }

  filterTextChange() {

    if (this.filterSearch == "") {
      this.alltasks = [];
      this.allTicketsData = [];
      this.getAllTickets()
    }
  }
  filterTextChange1() {
    this.alltasks = [];
    this.allTicketsData = [];
    this.getAllTickets()
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
      //console.log(res);

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
      //console.log(res);

      if (res.status == 200) {
        this.tagsData = res.response;
      }
      else {
        this.tagsData = [];
      }
    })
  }
managersDataList : any =[];
  bindManagers(){
    this.spinner = true;
    const obj = {
      "exp":"",
      "id":1
    }
    this.api.postMethod1('users/GetManagerList', obj).subscribe((res: any) => {
      if(res.status == 200){
       this.managersDataList = res.response;
       this.spinner = false;
  
      }else{
        this.managersDataList = [];
        this.spinner = false;
      }
  
    });
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
ticketData : any = "";
  acknowledgeConfirm(modal : any ,ticketData : any){
    this.ticketData = ticketData;
    this.modalRef = this.modalService.open(modal, {
      windowClass: 'ackConfirmBYModal',
      size: 'sm',
      backdrop: 'static',
    })
  }

  acknowledge() {
    this.spinner = true;
    const obj = {
      "TicketID": this.ticketData.Ticket,
      "LoginId": this.common.userid,
      "Title": this.ticketData.TaskTitle,
      "Details": this.ticketData.Details,
      "remail": this.ticketData.ReqUserEmail
    }
    //console.log(this.ticketData,obj);
    
    this.api.postMethod1('xpert/AcknowledgeAppSuppTask',obj).subscribe((res: any)=>{
      //console.log(res);
      if(res.status == 200){
        const obj = {
          "TaskId": this.ticketData.T_ID, "UserID": this.common.userid
        }
        //console.log(obj)
        this.api.postMethod1('users/GetTaskViewbyId', obj).subscribe((res: any) => {
          if (res) {
         this.api.setUpdateTaskValue({data : res , updateValue : 1})
          }
        });
        this.spinner = false;
        this.toastr.success('Ticket acknowledged successfully.');
        this.modalRef.close();
      }
      else{
        this.toastr.error('Ticket was already acknowledged.');
        this.modalRef.close();


      }
    })
  }

  openComponent1(){
    alert()
  }

  openComponent(task: any, component: any,event: MouseEvent) {
    event.preventDefault();  // Prevents the default action
    event.stopImmediatePropagation();
    this.api.setTicketData(task);
    localStorage.setItem('ID',task.T_ID)

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
        // centered: true,
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
  openCreatedByModal(modal: any, type: any) {
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
      this.bindStatusCounts()
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
        // if (type == 'alltasks') {
        //   this.modalRef = this.modalService.open(this.openCreatedByModalPopup, {
        //     windowClass: 'createdBYModal',
        //     size: 'lg',
        //     backdrop: 'static',
        //     centered: true
        //   })
        // }

        this.spinner = false;

      }
      else {
        this.createdUsersList = [];
        // if (type == 'alltasks') {

        //   this.modalRef = this.modalService.open(this.openCreatedByModalPopup, {
        //     windowClass: 'createdBYModal',
        //     size: 'lg',
        //     backdrop: 'static',
        //     centered: true
        //   })
        // }
        this.spinner = false;
      }
    })
  }
  usersInfoList : any =[]
  bindUsersInfo(){
    this.spinner = true;
    const obj =
    {
      "id": 0,
      "expression": '',
      "type": "F",
      "DeptTag": 0
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

  selectAssinedUser(){
    this.bindStatusCounts();
  }

  selectManager(){
    this.bindStatusCounts()
  }

  // selectedUser: any = null;
  hoveredUser: any = null;

  selectUser() {
    this.bindStatusCounts();
  }

  hoverUser(user: any) {
    this.hoveredUser = user;
  }

  createdUserListFunction() {
    // this.filterCreatedBy = this.selectedUser.T_UserName;

    // this.bindStatusCounts();
    // this.modalRef.dismiss();

  }

  clearDueDate() {
    this.filterDueDate = "";
    this.bindStatusCounts();
  }
  clearAssignedby() {

    this.filterAssignedUser = "";
    this.filterAssignUserId = 0;
    this.bindStatusCounts();
  }
  clearCreatedBy() {

    this.filterCreatedBy = "";
    this.bindStatusCounts();
  }

  openExcelModal(excelModal: any) {
    this.modalRef = this.modalService.open(excelModal, {
      windowClass: 'createdBYModal',
      size: 'lg',
      backdrop: 'static',
      centered: true
    })
  }

}
