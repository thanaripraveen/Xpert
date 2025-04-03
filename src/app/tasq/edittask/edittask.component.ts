import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { common } from '../../common';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-edittask',
  templateUrl: './edittask.component.html',
  styleUrl: './edittask.component.scss'
})
export class EdittaskComponent implements OnInit {
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
      sanitize: false
    };
  spinner : boolean = false;
  priorties = [
    { label: 'Low', value: 3 },
    { label: 'Medium', value: 2 },
    { label: 'High', value: 1 }
  ];
  constructor(private api: ApiService, private toastr: ToastrService, private router: Router, private common: common,
    public activeModal: NgbActiveModal, private modalService: NgbModal, private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    
  }

  closeModal() {
    this.activeModal.close();
  }
}
