import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as bootstrap from 'bootstrap';



@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
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

  commentsArray : any =[];
  ticketData : any;
  spinner : boolean = true;
  userID : any;
  commentForm: FormGroup | any;
  publicStatus: any = 'N';
  sendMailStatus: boolean = false;


  
  constructor(public activeModal: NgbActiveModal,private api : ApiService,private common : common,private fb : FormBuilder){
    this.commentForm = this.fb.group({
      txtNotes: ['', [Validators.required]]
    })

    this.userID = this.common.userid;
  }

  ngOnInit(): void {
    this.commentsArray = [];
    this.api.getTicketData().subscribe((res: any)=>{
      if(res){
        this.ticketData = res;
        this.getComments()
      }
    })
  }

  getComments(){
    const obj = {
      "ticket": this.ticketData.Ticket,
      "userid": this.common.userid,
      "id": 1
    }
    this.api.postMethod1('xpert/GetTaskComments', obj).subscribe((res: any) => {
      if (res.status == 200 && res.response.length > 0) {
          this.commentsArray = res.response.filter((item: any) => item.commentStatus != 'D');
          this.spinner = false;
      } else {
        this.commentsArray = [];
        this.spinner = false;
      }
    });
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

  publicStatusEvent(e: any) {
    if (e.target.checked) {
      this.publicStatus = 'Y'
    }
    else {
      this.publicStatus = 'N'
    }
  }

  sendMailEvent(e: any) {
    this.sendMailStatus = e.target.checked;
    if (this.sendMailStatus == true && this.ticketData.ReqDealerId == 100) {
      this.getDealerBasedData();
    }
  }

  internalusername: any = '';
  internaluseremail: any = '';
  getDealerBasedData() {
    let obj = {
      'userid': this.common.userid,
      'ticketid': this.ticketData.Ticket,
    }
    this.api.postmethod('Comments/GetInternalUser', obj).subscribe((res: any) => {
      if (res.responsecode == 200) {
        this.internalusername = res.InternalUsersData[0].ReqUserName;
        this.internaluseremail = res.InternalUsersData[0].ReqUserEmail;
      }

    })
  }

  
  closeModal() {
    this.activeModal.close();
  }

  selectedImage: any;
  onImageClick(event: MouseEvent) {
    const target = event.target as HTMLImageElement;
    if (target && target.tagName === 'IMG') {
      this.selectedImage = target.src
      const modal = new bootstrap.Modal(document.getElementById('screenshotModal') as HTMLElement);
      modal.show();
    }
  }


}
