import { Component,OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorComponent, AngularEditorConfig } from '@kolkov/angular-editor';
import moment from 'moment';

@Component({
  selector: 'app-groupmessages',
  templateUrl: './groupmessages.component.html',
  styleUrl: './groupmessages.component.scss'
})
export class GroupmessagesComponent implements OnInit {
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
gridForm : boolean = true;
dealer : any = 0;
groupMessagesDataList: any =[];
dealersData : any =[];
action = 'A';
submitted : boolean = false;
groupMessagesForm : FormGroup | any;

  @ViewChild(AngularEditorComponent) editorComponent!: AngularEditorComponent;
  constructor(private api: ApiService,private common : common, private toastr : ToastrService,private fb : FormBuilder){
    this.groupMessagesForm = this.fb.group({
      expiryDate : ['',Validators.required],
      description : ['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.bindDealerData();
  }

  bindDealerData() {
    this.spinner = true;
    const obj = {
      "searchstring": this.dealer,
      "userId": this.common.userid
    }
    this.api.postMethod1('users/GetAutoCompleteDealersData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.dealersData = res.response;
        this.dealer = this.dealersData[0].dealer_id;
        this.getGroupMessages();
      }
      else {
        this.dealersData = [];
        this.spinner = false;
      }
    })
  }

  getGroupMessages(){
    const obj = {
      'groupId' : this.dealer
    }
    this.api.postMethod1('xpert/GetGroupMessages',obj).subscribe((res: any)=>{
      if(res.status == 200){
        this.groupMessagesDataList = res.response;
        this.spinner = false;
      }
      else{
        this.spinner = false;
        this.groupMessagesDataList = [];
      }
    })
  }

  changeDealer(){
    this.getGroupMessages();
  }
  selectDate : Date = null;
  onDateChange(selectedDate: Date) {
    if (selectedDate) {
      this.selectDate =selectedDate;
    }
  }
  status : boolean = true;
  statusClick(e: any,msg : any){
    this.status = e;
    const obj ={
        
      "action": 'U',
      "id": msg.Id,
      "userId":this.common.userid,
      "group_message":msg.Group_Message,
      "groupId":msg.GroupId,
      "ticketId":0,
      "status" : e
  }
  this.api.postMethod1('xpert/GroupMessageAction',obj).subscribe((res: any)=>{
    if (res.status == 200) {
      this.spinner = false;
      this.getGroupMessages();
      this.toastr.success('Message status updated successfully');
    }
    else{
      this.spinner = false;
      this.getGroupMessages();
      this.toastr.error('Unable to process your request... please try again');
    }
  });
  }

  removeGroup_MessageTags(str:any){
    str = str.replace(/<img[^>]*>/g, '');
    str = str.replace(/<font[^>]*>/g, '');
    str = str.replace(/<\/font>/g, '');
    return str ? str.replace(/<br\s*\/?>/gi, '') : str;
}

  addNewGroupMessage(){
    this.gridForm = !this.gridForm;
  }
  editGrpMsg(msgData : any){
    this.messageId = msgData.Id;
    this.action = 'U';
    this.groupMessagesForm.controls.expiryDate.setValue(new Date(msgData.GM_EXP_Date))
    this.groupMessagesForm.controls.description.setValue(msgData.Group_Message)
    this.status  = msgData.Status == 'Y' ? true : false;
    this.gridForm = !this.gridForm;
  }

  handleStatus(e: any) {
    this.status = e.target.checked;
  }

  onPaste(event: ClipboardEvent) {
    setTimeout(() => {
      const editorElem = this.editorComponent?.textArea?.nativeElement as HTMLElement;
      if (editorElem) {
        const images = editorElem.querySelectorAll('img');
        images.forEach(img => {
          img.style.maxWidth = '200px'; // Fixed max width
          img.style.height = 'auto';    // Maintain aspect ratio
        });
      }
    }, 100);
  }
  messageId : any =0;
  submitClick(){

    if(this.groupMessagesForm.invalid){
      this.submitted = true;
      this.spinner = false;
    }
    else{
      const obj ={
        "action": this.action,
        "id": this.action == 'A' ? 0 : this.messageId,
        "userId":this.common.userid,
        "group_message": this.groupMessagesForm.controls.description.value ,
        "groupId":this.dealer,
        "ticketId":0,
        "status" : this.status == true ? 'Y' : 'N',
        "exp_date": moment(this.groupMessagesForm.controls.expiryDate.value).format('YYYY-MM-DD')
    }   
    this.api.postMethod1('xpert/GroupMessageAction',obj).subscribe((res: any)=>{
      if(res.status == 200){
        let msg = this.action == 'A' ? 'Message added successfully' : 'Message updated successfully';
        this.toastr.success(msg);
        this.reset();
      }
      else{
        this.toastr.error('Unable to process your request. please try again');
        this.reset();
      }
    });
    }
  }
  reset(){
    this.groupMessagesForm.reset();
    this.gridForm = !this.gridForm;
    this.spinner = false;
    this.messageId = 0;
    this.action = 'A';
    this.getGroupMessages();

  }

}
