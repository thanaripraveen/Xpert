import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { common } from '../../common';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UsersinfoComponent } from '../usersinfo/usersinfo.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
    sanitize: false
  };
  tagsDataList: any = []
  dealer: any = "";
  followerLoader: boolean = false;
  bindfollowersData: any = [];
  taskFollwersFilterList: any = [];
  movedRows: any = [];
  tagsLoader: boolean = false;
  AssignUserData: any = "";
  spinner: boolean = false;
  createTaskForm: FormGroup | any;
  bindDueDate: Date;
  action: any = 'A';
  ticketUpdateId: any = 0;
  submitted: boolean = false;
  selectedTagsIds: any = [];
  selectedFollowerIds: any = [];
  selectedFiles: File[] = [];
  priorties = [
    { label: 'Low', value: 3 },
    { label: 'Medium', value: 2 },
    { label: 'High', value: 1 }
  ];
  constructor(private api: ApiService, private toastr: ToastrService, private router: Router, private common: common,
    public activeModal: NgbActiveModal, private modalService: NgbModal, private fb: FormBuilder
  ) {
    this.createTaskForm = this.fb.group({
      ticketFrom: ['', [this.action == 'A' ? Validators.required : '']],
      email: [''],
      dealer: [''],
      title: ['', [Validators.required]],
      dueDate: [''],
      description: ['', Validators.required],
      ticketStatus: [''],
      priority: ['']
    })
    this.createTaskForm.get('ticketFrom')?.valueChanges.subscribe(value => {
      const txtEmailControl = this.createTaskForm.get('email');
      const txtDealerControl = this.createTaskForm.get('dealer');
      txtEmailControl?.setValidators(value === 'F' && this.action == 'A' ? [Validators.required, Validators.email] : []);
      txtDealerControl?.setValidators(value === 'F' && this.action == 'A' ? [Validators.required] : []);
      txtEmailControl?.updateValueAndValidity();
      txtDealerControl?.updateValueAndValidity();
    });
  }
  ngOnInit(): void {
    this.bindDueDate = new Date();
    this.bindDueDate.setDate(this.bindDueDate.getDate() + 2);
    this.createTaskForm.controls.dueDate.setValue(this.bindDueDate)
    this.bindTagsDataList();
    this.bindDealerData();
    this.bindFollowers();
    this.api.getUserInfoData().subscribe((res: any) => {
      if (res) {
        this.AssignUserData = res;
      }
    })
  }
  dealersData: any = [];
  bindDealerData() {
    const obj = {
      "searchstring": this.dealer,
      "userId": this.common.userid
    }
    this.api.postMethod1('users/GetAutoCompleteDealersData', obj).subscribe((res: any) => {
      console.log(res);

      if (res.status == 200) {
        this.dealersData = res.response;
      }
      else {
        this.dealersData = [];
      }
    })
  }
  bindTagsDataList() {
    this.tagsLoader = true;
    const obj = {
      "exp": 0,
      "userid": this.common.userid
    }
    this.api.postMethod1('xpert/GetSuggestedTagsList', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.tagsDataList = res.response;
        this.tagsLoader = false;
      }
      else {
        this.tagsDataList = [];
        this.tagsLoader = false;
      }
    })
  }
  bindFollowers() {
    this.followerLoader = true;
    const obj = {
      "ID": 0,
      "type": "F",
      "DeptTag": 0,
      "expression": 'u_uid not in (' + this.common.userid + ')'
    }
    this.api.postMethod1('users/GetfollowersData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.bindfollowersData = res.response;
        this.taskFollwersFilterList = res.response;
        this.followerLoader = false;
      }
      else {
        this.bindfollowersData = [];
        this.followerLoader = false;
      }
    })
  }
  searchFollowerName(e: any) {
    this.bindfollowersData = this.taskFollwersFilterList.filter(element =>
      element.FirstName.toLowerCase().includes(e.target.value.toLowerCase()) || element.MiddleName.toLowerCase().includes(e.target.value.toLowerCase()) ||
      element.LastName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    this.bindfollowersData = this.bindfollowersData.filter((e: any) => !this.movedRows.some((item: any) => e.UserId == item.UserId));
  }
  selectedRows: any = []; // Array to store selected row indexes
  selectRow(indexData: any) {
    const selectedIndex = this.selectedRows.indexOf(indexData);
    if (selectedIndex === -1) {
      this.selectedRows.push(indexData);
    } else {
      this.selectedRows.splice(selectedIndex, 1);
    }
  }
  doubleClick(fData: any, fromValue: any) {
    this.selectedRows.push(fData);
    this.moveSelectedRows(fromValue);
  }
  isSelected(index: any): boolean {
    return this.selectedRows.includes(index);
  }
  moveSelectedRows(fromvalue: any) {
    if (this.selectedRows.length > 0) {
      if (fromvalue == 1) {
        this.selectedRows.forEach(selectedItem => {
          const index = this.bindfollowersData.findIndex(item => item.UserId == selectedItem.UserId);
          if (index !== -1) {
            this.bindfollowersData.splice(index, 1); // Remove item from firstArray
          }
        });
        for (let i = 0; i < this.selectedRows.length; i++) {
          this.movedRows.push(this.selectedRows[i]);
        }
        this.movedRows = [...new Set(this.movedRows)];
        this.movedRows.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
        this.selectedRows = []
      }
      else {
        this.selectedRows.forEach(selectedItem => {
          const index = this.movedRows.findIndex(item => item.UserId == selectedItem.UserId);
          if (index !== -1) {
            this.movedRows.splice(index, 1); // Remove item from firstArray
          }
        });
        for (let i = 0; i < this.selectedRows.length; i++) {
          this.bindfollowersData.push(this.selectedRows[i]);
        }
        this.bindfollowersData = [...new Set(this.bindfollowersData)];
        this.bindfollowersData.sort((a: any, b: any) => a.FirstName.localeCompare(b.FirstName));
        this.selectedRows = []
      }
    }
    else {
      this.toastr.warning('Select user from followers list')
    }
  }
  selectedTagsList: any = []
  selectTagClick(tagData: any) {
    this.selectedTagsList.push(tagData);
    this.tagsDataList = this.tagsDataList.filter((item: any) => item.tag_id != tagData.tag_id);
    this.tagsDataList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
    this.selectedTagsList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
  }
  unSelectTagClick(tagData: any) {
    this.tagsDataList.push(tagData);
    this.selectedTagsList = this.selectedTagsList.filter((item: any) => item.tag_id != tagData.tag_id);
    this.tagsDataList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
    this.selectedTagsList.sort((a: any, b: any) => a.Tag_Name.localeCompare(b.Tag_Name));
  }
  openAssignModal() {
    this.modalService.open(UsersinfoComponent, {
      windowClass: 'userInfoModal',
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
  }
  closeModal() {
    this.activeModal.close();
  }
  dateChange(){
    if(this.createTaskForm.controls.dueDate.value == ""){
      let cuntDate = new Date();
      cuntDate.setDate(cuntDate.getDate() + 2);
      this.createTaskForm.controls.dueDate.setValue(cuntDate);
    }
  }
  clearDate(datepicker: any) {
    this.createTaskForm.controls.dueDate.setValue('');
    datepicker.hide(); // Hide datepicker
  }
  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }
  saveAndUpdateTicket() {
    if (this.createTaskForm.invalid) {
      this.submitted = true;
    }
    else {
      for (let i = 0; i < this.selectedTagsList.length; i++) {
        this.selectedTagsIds.push(this.selectedTagsList[i].tag_id)
      }
      for (let i = 0; i < this.movedRows.length; i++) {
        this.selectedFollowerIds.push(this.movedRows[i].UserId)
      }
      const obj = {
        'Action': this.action,
        'Id': this.action == 'A' ? 0 : this.ticketUpdateId,
        'CreatedAdmId': this.common.userid,
        'Title': this.createTaskForm.controls.title.value,
        'Description': this.createTaskForm.controls.description.value,
        'Tags': this.selectedTagsIds.join(","),
        'ASTU_Id': this.AssignUserData == "" ? 0 : this.AssignUserData.UserId,
        'AckStatusTypeId': this.createTaskForm.controls.ticketStatus.value,
        'DealerId': this.createTaskForm.controls.ticketFrom.value == 'A' || !this.createTaskForm.controls.dealer.value ? 100 : this.createTaskForm.controls.dealer.value,
        'DueDate': this.createTaskForm.controls.dueDate.value.toISOString(),
        'FollowersIds': this.selectedFollowerIds.join(","),
        'priority': this.createTaskForm.controls.priority.value,
        'status': 'Y',
        'Loginfrom': 'D',
        'ParentId': '0',
        'TitleIds': '',
        'tasktype': 0,
        'taskfrom': this.createTaskForm.controls.ticketFrom.value,
        'mailid': this.createTaskForm.controls.ticketFrom.value == 'F' ? this.createTaskForm.controls.email.value : this.common.email,
        'sendMailStatus': 'N'
      }
      this.api.postMethod1('xpert/CreateAppSupportTask', obj).subscribe((res: any) => {
        if (res.status == 200) {
          const fd = new FormData();
          fd.append('ticketId', res.response.ticketId)
          fd.append('fuid', this.common.userid)
          if (this.selectedFiles.length > 0) {
            this.selectedFiles.forEach((file) => {
              fd.append('file', file)
            });
          }
          else {
            fd.append('file', new Blob([''], { type: 'text/plain' }));
          }
          this.api.postMethod1('xpert/uploadFiles', fd).subscribe((res: any) => {
            this.submitted = false;
            this.createTaskForm.reset();
            this.action = 'A';
            this.spinner = false;
            this.activeModal.close();
            this.toastr.success('Ticket details added successfully');
            
            // this.socketService.sendTask();
            //  this.router.navigate(['dashboard']);
            // this.router.navigate([this.redirectRouteUrl]);
          })
        }
        else {
          this.submitted = false;
          this.createTaskForm.reset();
          this.action = 'A';
          this.spinner = false;
          this.activeModal.close();
          this.toastr.error('Unable to process your request, please try again..');
          // this.router.navigate([this.redirectRouteUrl]);
        }
      })
    }
  }
}
