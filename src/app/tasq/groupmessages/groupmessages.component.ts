import { Component,OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-groupmessages',
  templateUrl: './groupmessages.component.html',
  styleUrl: './groupmessages.component.scss'
})
export class GroupmessagesComponent implements OnInit {
spinner : boolean = false;
gridForm : boolean = false;
  constructor(private api: ApiService,private common : common, private toaster : ToastrService,){

  }

  ngOnInit(): void {
    
  }

  addNewRole(){

  }

}
