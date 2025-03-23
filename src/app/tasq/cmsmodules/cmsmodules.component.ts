import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';

@Component({
  selector: 'app-cmsmodules',
  templateUrl: './cmsmodules.component.html',
  styleUrl: './cmsmodules.component.scss'
})
export class CmsmodulesComponent implements OnInit{

  constructor(private api : ApiService,private toastr : ToastrService, private common : common){}

  ngOnInit(): void {
    
  }
}
