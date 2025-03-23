import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { common } from '../../common';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrl: './createtask.component.scss'
})
export class CreatetaskComponent implements OnInit {
    config: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '15rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      defaultFontName: 'Arial',
      defaultFontSize: '3px',
      toolbarPosition: 'top', // Options: 'top' or 'bottom'
      defaultParagraphSeparator: 'p',
      sanitize:false 
    };

  spinner : boolean = false;
  constructor(private api : ApiService,private toastr : ToastrService,private router : Router,private common : common,
    public activeModal: NgbActiveModal,private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    
  }

  closeModal(){
    this.activeModal.close();
  }

}
