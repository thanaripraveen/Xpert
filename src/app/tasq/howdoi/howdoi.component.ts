import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';

@Component({
  selector: 'app-howdoi',
  templateUrl: './howdoi.component.html',
  styleUrl: './howdoi.component.scss'
})
export class HowdoiComponent implements OnInit {
spinner : boolean = false;
gridForm : boolean = true;
dealer : any ="";
dealersData : any =[]
  constructor(private api : ApiService,private common : common){}
  ngOnInit(): void {
   this.bindDealerData();
   this.getModule();
  }

  changeDealer(e: any){

  }

  addNew(){

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

  modulearr: any
  getModule() {
    this.api.postMethod1('xpert/GetXpertModules', "").subscribe((res: any) => {
      if (res.length !== 0) {
        this.modulearr = res.response;
       
      } else {
        this.modulearr = [];
      }
    });

  }
}
