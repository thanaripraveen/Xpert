import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';

@Component({
  selector: 'app-userguide',
  templateUrl: './userguide.component.html',
  styleUrl: './userguide.component.scss'
})
export class UserguideComponent implements OnInit {
  spinner : boolean = false;
  gridForm : boolean = true;
  dealer : any =0;
  dealersData : any =[];
  getHelpData : any =[]

  constructor(private api : ApiService, private common : common){}

  ngOnInit(): void {
    this.bindDealerData();
  }

  bindDealerData() {
    const obj = {
      "searchstring": this.dealer,
      "userId": this.common.userid
    }
    this.api.postMethod1('users/GetAutoCompleteDealersData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.dealersData = res.response;
        this.dealer = this.dealersData[0].dealer_id;
        this.getHelpXpertData();
      }
      else {
        this.dealersData = [];
      }
    })
  }

  changeDealer(){
    this.getHelpXpertData();
  }

  addNewRole(){

  }

  getHelpXpertData(){
    this.spinner = true;
    const obj= {
      "id" : this.dealer
    }
    this.api.postMethod1('xpert/GetXpertHelp',obj).subscribe((res: any)=>{
      if(res.status == 200 &&  res.response.length > 0){
        this.getHelpData = res.response;
        this.spinner = false;
      }
      else{
        this.getHelpData = [];
        this.spinner = false;
      }
      
    })
  }

  editHelpData(userguideData : any, ){

  }
}
