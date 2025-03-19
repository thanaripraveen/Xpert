import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { CommentsComponent } from '../comments/comments.component';
import { DetailsComponent } from '../details/details.component';
import { SavedocumentsComponent } from '../savedocuments/savedocuments.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { common } from '../../common';

@Component({
  selector: 'app-mytickets',
  templateUrl: './mytickets.component.html',
  styleUrl: './mytickets.component.scss'
})
export class MyticketsComponent implements OnInit {
  spinner : boolean = false;

  dealersData : any =[];
  xpertProfileImg: any = environment.xpertProfileImg;
  priorties: any = [
    { id: 3, priorty: 'Low', color: 'green' },
    { id: 2, priorty: 'Medium', color: 'blue' },
    { id: 1, priorty: 'High', color: 'red' },
  ]
  userID: any;
  roleId: any;
  taskDetailsList: any = [];
  countsData : any = [];
  // Filter Row

  filterDealer : any ="";
  txtSearch : any ="";
  rowCount : any =0;
  showhide : boolean = false;
  

  sortValue : any ='A';
  flag : any = 'A';

  constructor(private api : ApiService,private router : Router,private toastr : ToastrService,
    private modalService: NgbModal,private common : common){}

  ngOnInit(): void {

    this.bindMyTickets();
    this.bindDealerData();
    
  }

  bindMyTickets() {
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
        "assignid": this.flag == 'F' ? 0 : this.flag == 'C' ? 0 : this.common.userid,
        "priority": 0,
        "sortby": 0,
        "orderby": this.sortValue,
        "createdby": "",
        "flag": this.flag
    }

    this.api.postMethod1('users/GetMyTickets', obj).subscribe(res => {
      console.log(res);
      // if (res.status === 200) {
        // this.taskDetailsList = res.response;
        this.countsData = res.response;
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
         this.spinner = false;
        this.showhide = false;
         alert(this.spinner)
       }
        this.spinner = false;    
    });
  }

  viewMore(){
    this.rowCount = this.taskDetailsList.length;
    this.bindMyTickets();
  }

  activeButton = 'assigntome'; // Default ga first button active

  setActive(button: string) {
    this.activeButton = button;
    this.flag = button == 'follower' ? 'F' : button == 'assigntome' ? 'A' : 'C';
    this.taskDetailsList = [];
    this.bindMyTickets();
  }

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

  dealerChange(){
    this.taskDetailsList =[]
    this.bindMyTickets();
  }

  onSearchSubmit() {
    this.bindtextboxsearchdata();
  }
  
  bindtextboxsearchdata() {
    this.taskDetailsList = [];
    this.showhide = false;
    this.bindMyTickets(); 
  }
  
  onSearchFocus() {
    if (this.txtSearch == "") {
      this.bindtextboxsearchdata();
    }
  }

  tickets(route : any){
    this.router.navigateByUrl(route);
  }

  onSelectChange(event: any, Ticket: any): void {
    const obj = {
      "ticketId": Ticket,
      "priorityid": event.target.value
    }
    this.api.postMethod1('xpert/UpdateTicketPriority', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.toastr.success("Priority updated successfully");
        //  this.socketService.sendTask();
      }
      else{

      }

    })
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

}
