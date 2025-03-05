import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';



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
  private modalRef!: NgbModalRef;

  usersInfoList: any = [];
  subscription : Subscription
  constructor(public activeModal: NgbActiveModal,private api : ApiService,private common : common,private fb : FormBuilder,
    private modalService: NgbModal, private toastr : ToastrService){
    this.commentForm = this.fb.group({
      txtNotes: ['', [Validators.required]]
    })

    this.userID = this.common.userid;
  }

  ngOnInit(): void {
    this.commentsArray = [];
   this.subscription = this.api.getTicketData().subscribe((res: any)=>{
      if(res){
        this.ticketData = res;
        this.getComments();
        this.usersInfo()
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  usersInfo() {
    const obj =
    {
      "id": 0,
      "expression": '',
      "type": "F",
      "DeptTag": 0
    }
    this.api.postMethod1('users/GetUserData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.usersInfoList = res.response
      }
    })
  }
  ddlUserName : any = "";

  sendCommentsToMail() {
    this.spinner =true;
    const obj = {
      "ticketId": this.ticketData.Ticket,
      "Email": this.ddlUserName.Email
    }
    this.api.postmethod('TasQService/GetCommentsEmail',obj).subscribe((res: any)=>{
     if(res.Statecode == 200){
      this.toastr.success("Sent comments successfully!");
      this.ddlUserName = "";
      this.spinner= false;
     }else{
      this.toastr.error("Unable to process your request.Please try again");
      this.ddlUserName = "";
      this.spinner= false;
     }
    })
  }

  handlePaste(event: ClipboardEvent) {
    const items : any = event.clipboardData?.items;
    if (items) {
      for (let item of items) {
        if (item.type.startsWith('image')) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.createThumbnail(e.target.result);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    }
  }
  
  
  createThumbnail(base64: string) {
    const img = new Image();
    img.src = base64;
  
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Define the maximum dimensions
      const maxWidth = 800;
      const maxHeight = 500;
      let width = img.width;
      let height = img.height;
  
      // Maintain aspect ratio
      if (width > height) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      } else {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
  
      // Increase DPI for better quality (optional)
      const scaleFactor = 2; // Increase resolution
      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;
  
      if (ctx) {
        ctx.scale(scaleFactor, scaleFactor); // Scale for better clarity
        ctx.drawImage(img, 0, 0, width, height);
      }
  
      // Convert to Base64 with improved quality
      const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.9); // Use JPEG with high quality
  
      // Insert into the editor content without losing formatting
      let currentContent = this.commentForm.get('txtNotes')?.value || '';
      currentContent += `<img src="${thumbnailBase64}" class="screenshot-thumbnail">`;
      this.commentForm.get('txtNotes')?.setValue(currentContent);
    };
  }
  comment_Id : any = 0;
  editComment(data: any) {
    this.action = 'U';
    this.comment_Id = data.Id;
    this.publicStatus = data.publicStatus;
    this.sendMailStatus = false;
    this.commentForm.controls.txtNotes.setValue(data.commentEditDesc);
    this.validate(this.commentForm.controls.txtNotes.value)
  }


  submitted : boolean = false;
  action = 'A';

  saveAndEditComment() {
    this.spinner =true;
    if (this.commentForm.controls.txtNotes.value == "" && this.action != 'D') {
      this.validate(this.commentForm.controls.txtNotes.value);
    this.submitted = true;
      this.spinner = false;
    }
    else{
      const obj = {
        'action': this.action,
          'cid': this.comment_Id == 0 ? 0 : this.comment_Id,
          'ticketid': this.ticketData.Ticket,
          'comments': this.commentForm.controls.txtNotes.value,
          "createdid": this.common.userid,
          'usersList': '',
          'tklogid': '',
          'flag': 'N',
          'publicstatus': this.publicStatus,
          'source': 'A',
          'Tasktype': this.ticketData.ReqSource,
          'Username': this.ticketData.ReqDealerId == 100 ? this.internalusername : this.common.name,
          'Toemail': this.ticketData.ReqDealerId == 100 ? this.internaluseremail : this.ticketData.ReqUserEmail,
          'sendMail': this.sendMailStatus == true ? 'Y' : 'N',
          'dealerid': this.ticketData.ReqDealerId

      }
      this.api.postmethod('Comments/CommentsAction', obj).subscribe((res: any) => {
        if(res.responsecode == 200 && this.action == 'A'){

            this.toastr.success('Comment added successfully')
          const obj = {
            "TaskId": this.ticketData.ID, "UserID": this.common.userid
          }    
          this.api.postMethod1('users/GetTaskViewbyId', obj).subscribe((res: any) => {
            if (res.status == 200) {
           this.api.setUpdateTaskValue({data : res , updateValue : 1})
            }
          });

          this.reset();
          this.spinner = false;
          this.getComments()
        }
        else if(res.responsecode == 200 && this.action == 'U'){

          this.toastr.success('Comment updated successfully')
        const obj = {
          "TaskId": this.ticketData.ID, "UserID": this.common.userid
        }    
        this.api.postMethod1('users/GetTaskViewbyId', obj).subscribe((res: any) => {
          if (res.status == 200) {
         this.api.setUpdateTaskValue({data : res , updateValue : 1})
          }
        });

        this.reset();
        this.spinner = false;
        this.getComments()
      }
        else if(res.responsecode == 200 && this.action == 'D'){
          if (this.modalRef) {
            this.modalRef.close(); // Close modal
          }
          this.toastr.success('Comment deleted successfully')
        const obj = {
          "TaskId": this.ticketData.ID, "UserID": this.common.userid
        }    
        this.api.postMethod1('users/GetTaskViewbyId', obj).subscribe((res: any) => {
          if (res.status == 200) {
         this.api.setUpdateTaskValue({data : res , updateValue : 1})
          }
        });

        this.reset();
        this.spinner = false;

        this.getComments()
      }
        else{
          this.reset();
          this.spinner = false;
          this.toastr.error('Unable to your request..Please try again')

          // this.getComments()
        }
        
      })

    }
  }

  confirmDelete(content: any,comment : any) {
    this.comment_Id = comment.Id;
    this.action = 'D';
    // this.openBothModals()
  this.modalRef =  this.modalService.open(content,{
      windowClass: 'deleteCommentModal',
        size: 'sm', 
        backdrop: 'static',
    })
  }

  reset() {
    this.commentForm.controls.txtNotes.setValue('');
    this.isInvalid = false;
    this.publicStatus = 'N'
    this.action = 'A';
    this.submitted = false;
    this.sendMailStatus = false;

  }

  isInvalid = false;
  validate(content: string) {
    this.isInvalid = !content.trim();
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
