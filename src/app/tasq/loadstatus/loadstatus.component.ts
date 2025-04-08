import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';

@Component({
  selector: 'app-loadstatus',
  templateUrl: './loadstatus.component.html',
  styleUrl: './loadstatus.component.scss'
})
export class LoadstatusComponent implements OnInit {
spinner : boolean = false;
gridForm : boolean = true;
dealer : any ="";
selectDate : any = new Date();
dealersData: any = [];
loadStatusData : any =[]
  constructor(private api : ApiService, private common : common,private toastr : ToastrService){

  }

  ngOnInit(): void {
    this.bindDealerData();
    this.getDataLoads();
  }

  addNewLoadstatus(){
    this.gridForm = !this.gridForm;
  }

  clearDate(date : any){

  }


  bindDealerData() {
    const obj = {
      "searchstring": this.dealer,
      "userId": this.common.userid
    }
    this.api.postMethod1('users/GetAutoCompleteDealersData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.dealersData = res.response;
      }
      else {
        this.dealersData = [];
      }
    })
  }

  getDataLoads(){
    this.spinner = true;
     const obj ={
      "date":moment(this.selectDate).format('YYYY/MM/DD'),
      "exp": this.dealer == '' ? '' :  `ls_client='${this.dealer}`
  }
  this.api.postMethod1('xpert/GetLoadStatus',obj).subscribe((res: any)=>{
    if(res.status == 200){
      this.loadStatusData = res.response;
      this.spinner = false;
    }
    else{
      this.loadStatusData = [];
      this.spinner = false;
    }  
  })
  }

  convertToIST(utcDate: any) :any {
    var utc = moment.utc(utcDate);
    var dateWithTimezone = utc.local().format('HH:mm');
    return dateWithTimezone + ' ' + 'IST'
  
  }
}
