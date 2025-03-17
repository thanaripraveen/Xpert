import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';
import * as bootstrap from 'bootstrap';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { environment } from '../../../environments/environment'
import { LoginComponent } from '../../login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SavedocumentsComponent } from '../savedocuments/savedocuments.component';
import { Router } from '@angular/router';
import { CommentsComponent } from '../comments/comments.component';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  
})
export class DashboardComponent implements OnInit {
  spinner: boolean = true;
  xpertProfileImg: any = environment.xpertProfileImg;
  priorties: any = [
    { id: 3, priorty: 'Low', color: 'green' },
    { id: 2, priorty: 'Medium', color: 'blue' },
    { id: 1, priorty: 'High', color: 'red' },
  ]
  userID: any;
  roleId: any;
  taskDetailsList: any = []

  txtSearch : any ="";
  dashboardType : any = 9;
  dashboardOrderBy : any = "T_iD desc";

  overdueToggleValue : boolean = false;

  filterDealer : any ="";
  filterPriority : any = 0
  constructor(private api: ApiService, private toastr: ToastrService,
    private common: common, private modalService: NgbModal,private router : Router) {
    this.userID = this.common.userid;
    this.roleId = this.common.roleid;
  }

  ngOnInit(): void {
    this.api.getUpdateTaskValue().subscribe((res: any)=>{
      console.log(res);
      
      if(res.updateValue == ""){
        this.BindDashboard();
      }
      else{
        const index = this.taskDetailsList.findIndex((item : any) => item.ID === res.data.response[0].ID);
        if (index !== -1) {
          this.taskDetailsList[index] = res.data.response[0];
        }
      }
    })

    this.bindDealerData()
  }

  showhide : boolean = false;
  BindDashboard() {
    this.spinner = true;
    const obj ={
        "taskId": 0,
        "userId": this.common.userid,
        "maxId": this.rowCount,
        "exp": this.txtSearch == "" ? "" : this.txtSearch,
        "exp2": this.filterDealer == "" ? '' : "T_DealerId=" + this.filterDealer,
        "stat": "",
        "duedate": "",
        "tagid": 0,
        "assignid": 0,
        "priority": this.filterPriority == 0 ? 0 : this.filterPriority,
        "sortby": "",
        "orderby": "A",
        "createdby": "",
        "flag": ""
    }

    this.api.postMethod1('users/GetMyTickets', obj).subscribe(res => {
      console.log(res);
      // if (res.status === 200) {
        // this.taskDetailsList = res.response;

        if (res.status == 200 && res.response.data.length > 0) {
          const dashboardData = res.response.data;
         const newTasks = Array.isArray(dashboardData) ? dashboardData : (dashboardData ? [dashboardData] : []);
         this.taskDetailsList = this.taskDetailsList.length ? this.taskDetailsList.concat(newTasks) : newTasks;
         this.taskDetailsList.forEach(item => {
           const taskTags = item?.TaskTagsLists?.TaskTagsLists?.TaskTagsList;
           item.TaskTagsLists.TaskTagsLists.TaskTagsList = Array.isArray(taskTags) ? taskTags : (taskTags ? [taskTags] : []);
 
           if (item?.Folowers?.Folowers) {
             const followers = item?.Folowers?.Folowers?.Folower;
             item.Folowers.Folowers.Folower = Array.isArray(followers) ? followers : (followers ? [followers] : []);
           }
        this.showhide = newTasks.length > 19;

         this.spinner = false;
 
         });
       }
       else {
         this.taskDetailsList = [];
        this.showhide = false;
         this.spinner = false;
       }
        this.spinner = false;    
    });
  }
rowCount : any = 0;
  viewMore(){
    this.rowCount = this.taskDetailsList.length;
    this.BindDashboard();
  }
  dealersData : any =[]
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

  filterGrid() {
    this.taskDetailsList = []
    this.BindDashboard();
  }

  filterCancel(){
    this.filterDealer = "";
    this.filterPriority = 0;
    this.rowCount = 0;
    this.BindDashboard()
  }

  onSrchTxtboxkeyupFunction(){
    this.taskDetailsList =[];
    this.BindDashboard()

  }

  onSrchTxtboxEmptyFunction(){
    if(this.txtSearch == ""){
      this.taskDetailsList=[]
      this.BindDashboard()
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

  openComponent(task: any,component : any) {

    this.api.setTicketData(task)
    if(component == 'doc'){
      this.modalService.open(SavedocumentsComponent, {
        windowClass: 'documentModal',
        size: 'lg', 
        backdrop: 'static',
        centered: true, 
      });
    }
    else if(component == 'comments'){
      this.modalService.open(CommentsComponent, {
        windowClass: 'commentsModal',
        size: 'lg', 
        backdrop: 'static',
        centered : true, 
      });
    }
    else if(component == 'view'){
      this.modalService.open(DetailsComponent, {
        windowClass: 'viewModal',
        size: 'xl', 
        backdrop: 'static',
        centered: true, 
      });
    }
    else if(component == 'edit'){
      this.modalService.open(CommentsComponent, {
        windowClass: 'editModal',
        size: 'xl', 
        backdrop: 'static',
        centered: true, 
      });
    }


  }

  getsearchdata(type : any,srchflag : any){
    this.taskDetailsList = [];
    this.dashboardType = type;
    if(srchflag == 'ovrduediv'){
      this.overdueToggleValue = !this.overdueToggleValue;
      this.dashboardOrderBy = this.overdueToggleValue ? "Dueindays desc" : "Dueindays"; 
    }
    else{
      this.dashboardOrderBy = "T_id desc";
    }

    this.BindDashboard();

  }

  tickets(url : any){
    this.router.navigateByUrl(url)
  }
}
