import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';
import moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-releasenotes',
  templateUrl: './releasenotes.component.html',
  styleUrl: './releasenotes.component.scss'
})
export class ReleasenotesComponent implements OnInit {
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
  
  spinner: boolean = false;
  dealersData: any = [];
  filterDealer: any = "";
  txtNotes: any;
  DealerGroupCode: any;
  notesData: any = [];
  private modalRef!: NgbModalRef;

  constructor(private api: ApiService, private toastr: ToastrService, private common: common,private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.bindDealers();
  }

  bindDealers() {
    this.spinner = true;
    const obj = {
      "searchstring": this.filterDealer,
      "userId": this.common.userid
    }
    this.api.postMethod1('users/GetAutoCompleteDealersData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.dealersData = res.response;
        this.filterDealer = this.dealersData[0].dealer_id;
        this.DealerGroupCode = this.dealersData[0].Dealer_Group_Code;
        this.bindNotes();
      }
      else {
        this.spinner = false;
        this.dealersData = [];
      }
    })
  }

  bindNotes() {
    this.spinner = true;
    const obj = { "GroupId": this.filterDealer }
    this.api.postMethod1('xpert/GetXpertNotes', obj).subscribe((res: any) => {
      if (res.status == 200 && res.response.length > 0) {
        this.spinner = false;
        this.notesData = res.response;
      }
      else {
        this.spinner = false;
        this.notesData = [];
      }
    });
  }

  LocalTimeConvertioninHours(DateTime: any) {
    var utcDate = moment.utc(DateTime);
    var dateWithTimezone = utcDate.local().format('MM.DD.YY hh:mm A');
    return dateWithTimezone;

  }

  notesId: any;
  action: any = 'A';

  editNotes(editData: any) {
    this.spinner = true;
      this.action = 'U';
      this.notesId = editData.Id;
      this.txtNotes = editData.Notes;
      this.spinner = false;

  }
  deleteNotes(editData: any, modal: any) {
      this.action = 'D';
      this.notesId = editData.Id;
      this.txtNotes = "";

      this.modalRef = this.modalService.open(modal, {
        windowClass: 'ackConfirmBYModal',
        size: 'sm',
        backdrop: 'static',
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
      let currentContent = this.txtNotes || '';
      currentContent += `<img src="${thumbnailBase64}" class="screenshot-thumbnail">`;
      this.txtNotes = currentContent;
    };
  }

  saveNotes(){
    this.spinner = true;
    if ((this.txtNotes == "" || this.txtNotes == undefined || this.txtNotes == null) && this.action != 'D') {
      this.spinner = false;
      this.toastr.warning("Please enter notes");
    }
    else{
      const obj = {
        "action": this.action,
        "Id": this.action == 'A' ? 0 : this.notesId,
        "UserId": this.common.userid,
        "Email": '',
        "Notes": this.txtNotes,
        "GroupId": this.filterDealer,
        "TicketId": 0
      }

      this.api.postMethod1('xpert/XpertNotesAction',obj).subscribe((res: any)=>{

        if(res.status == 200 && this.action == 'A'){
          this.toastr.success('Notes added successfully');
          this.action = 'A';
          const obj = {
            "user_from_aou_id": this.common.userid,
            "user_to_aou_id": "0",
            "group_code": this.DealerGroupCode,
            "title": "New Release Notification",
            "message": this.txtNotes,
            'clientts': moment(new Date()).format('MM/DD/YYYY hh:mm:ss')
          }
          this.api.releaseNotication(obj).subscribe((res: any) => {
          })
          this.bindNotes();
          this.txtNotes = "";
          this.spinner = false;

        }

        else if (res.status == 200 && this.action == 'U') {
          this.txtNotes = '';
          this.action = 'A';
          this.spinner = false;

          this.toastr.success('Notes updated successfully');
          this.bindNotes();
        }
        else if (res.status == 200 && this.action == 'D') {
          this.txtNotes = '';
          this.action = 'A';
          this.spinner = false;

          this.toastr.success('Notes deleted successfully');
          this.modalRef.close();
          this.bindNotes();
        }
        else {
          this.txtNotes = '';
          this.action = 'A';
          this.spinner = false;

          this.toastr.error('Unable to process your request. please try again..');
        }

      })
    }
  }

  selectDealer() {
    this.txtNotes = "";
    this.action = 'A';
    this.bindNotes()
  }

  cancel(){
    this.action = 'A';
    this.txtNotes="";
  }

}
