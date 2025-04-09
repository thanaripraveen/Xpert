import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-newuserrequest',
  templateUrl: './newuserrequest.component.html',
  styleUrl: './newuserrequest.component.scss'
})
export class NewuserrequestComponent implements OnInit {
  spinner : boolean = false;
  getAxelOneUserReqData : any[] =[];
  searchText: string = '';
  filteredData: any[] = [];
  constructor(private api : ApiService,private toastr: ToastrService){

  }
  ngOnInit() {
    this.getAxelOneUserReq();
  }

  getAxelOneUserReq(){
    this.spinner = true;
    const obj ={
      "exp1":"",
      "exp2":""
      }
      
    this.api.postMethod1('xpert/GetAxeloneUserReq',obj).subscribe((res: any)=>{
      if(res.status == 200){
        this.getAxelOneUserReqData = res.response;
        this.filteredData = [...this.getAxelOneUserReqData];
        this.spinner = false;
      }
      else{
        this.getAxelOneUserReqData = [];
        this.filteredData = [];
        this.spinner = false;
      }
      
    })
  }

  searchData() {
    const searchLower = this.searchText.toLowerCase();
    this.filteredData = this.getAxelOneUserReqData.filter((item) =>
      Object.values(item).some((value: any) =>
        value.toString().toLowerCase().includes(searchLower)
      )
    );
  }


  onChange(event: any, aid: any): void {
    const obj = {
      "id":aid,
      "statusid":event.target.value
    }
    this.api.changePriority('xpert/UpdateUserReq',obj).subscribe((res: any)=>{
      if(res.status == 200){
        this.toastr.success("Status updated successfully");
      }     
    })
  }
}
