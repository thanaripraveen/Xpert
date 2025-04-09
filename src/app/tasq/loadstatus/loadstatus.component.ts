import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loadstatus',
  templateUrl: './loadstatus.component.html',
  styleUrl: './loadstatus.component.scss'
})
export class LoadstatusComponent implements OnInit {

  spinner: boolean = false;
  gridForm: boolean = true;
  dealer: any = "";
  selectDate: any = new Date();
  date: any = new Date();
  dealersData: any = [];
  loadStatusData: any = [];
  dataLoadStatusForm: FormGroup | any;
  submitted: boolean = false;
  action: any = 'A';
  loadStatusId: any = 0;
  private modalRef!: NgbModalRef;

  constructor(private api: ApiService, private common: common, private toastr: ToastrService, private fb: FormBuilder, private modalService: NgbModal) {
    this.dataLoadStatusForm = this.fb.group({
      client: ['', Validators.required],
      cdk: ['', Validators.required],
      reynolds: ['', Validators.required],
      driveCentric: ['', Validators.required],
      vAuto: ['', Validators.required],
      dealerFX: ['', Validators.required],
      time: ['', Validators.required],
      addDate: [null, Validators.required],
      comments: [''],
      counts: ['']
    })
  }

  ngOnInit(): void {
    this.bindDealerData();
    this.getDataLoads();
  }

  addNewLoadstatus() {
    this.gridForm = !this.gridForm;
  }

  bindDealerData() {
    const obj = {
      "searchstring": this.dealer,
      "userId": this.common.userid
    }
    this.api.postMethod1('users/GetAutoCompleteDealersData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.dealersData = res.response;
      }
      else {
        this.dealersData = [];
      }
    })
  }

  getDataLoads() {
    this.spinner = true;
    const obj = {
      "date": moment(this.selectDate).format('YYYY/MM/DD'),
      "exp": this.dealer == '' ? '' : `ls_client='${this.dealer}`
    }
    this.api.postMethod1('xpert/GetLoadStatus', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.loadStatusData = res.response;
        this.spinner = false;
      }
      else {
        this.loadStatusData = [];
        this.spinner = false;
      }
    })
  }

  convertToIST(utcDate: any): any {
    var utc = moment.utc(utcDate);
    var dateWithTimezone = utc.local().format('HH:mm');
    return dateWithTimezone + ' ' + 'IST'
  }

  onDateChange(selectedDate: Date) {
    if (selectedDate) {
      this.selectDate = selectedDate;
      this.getDataLoads();
    }
  }

  changeDealer(e: any) {
    this.getDataLoads();
  }

  editDataLoads(e: any) {
    this.spinner = true;
    this.gridForm = !this.gridForm;
    this.action = 'U';
    this.dataLoadStatusForm.controls.client.setValue(e.ls_client);
    this.dataLoadStatusForm.controls.cdk.setValue(e.cdk_status);
    this.dataLoadStatusForm.controls.reynolds.setValue(e.reynolds_status);
    this.dataLoadStatusForm.controls.driveCentric.setValue(e.drivecentric_status);
    this.dataLoadStatusForm.controls.vAuto.setValue(e.vauto_status);
    this.dataLoadStatusForm.controls.dealerFX.setValue(e.dealerfx_status);
    this.dataLoadStatusForm.controls.comments.setValue(e.addl_comments);
    this.dataLoadStatusForm.controls.counts.setValue(e.count);
    this.dataLoadStatusForm.controls.time.setValue(e.time);
    this.loadStatusId = e.id;
    const formattedDate = moment(e.date, 'YYYY-MM-DD').toDate(); // Adjust input format if needed
    this.dataLoadStatusForm.controls.addDate.setValue(formattedDate);
    this.date = formattedDate;
    // this.gridForm=true;
    this.spinner = false;
  }

  confirmDelete(modal: any, e: any) {
    this.action = 'D';
    this.loadStatusId = e.id;
    this.modalRef = this.modalService.open(modal, {
      windowClass: 'ackConfirmBYModal',
      size: 'sm',
      backdrop: 'static',
    })
  }
  loadStatusSave() {
    this.spinner = true;
    if (this.dataLoadStatusForm.invalid && this.action != 'D') {
      this.submitted = true;
      this.spinner = false;
    }
    else {
      let obj = {}
      if (this.action != 'D') {
        obj = {
          "action": this.action,
          "id": this.action == 'A' ? 0 : this.loadStatusId,
          "client": this.dataLoadStatusForm.controls.client.value,
          "date": moment(this.dataLoadStatusForm.controls.addDate.value).format('MM/DD/YYYY'),
          "cdk_status": this.dataLoadStatusForm.controls.cdk.value,
          "reynolds_status": this.dataLoadStatusForm.controls.reynolds.value,
          "drivecentric_status": this.dataLoadStatusForm.controls.driveCentric.value,
          "vauto_status": this.dataLoadStatusForm.controls.vAuto.value,
          "dealerfx_status": this.dataLoadStatusForm.controls.dealerFX.value,
          "checked_by": this.common.name,
          "counts": this.dataLoadStatusForm.controls.counts.value,
          "addl_comments": this.dataLoadStatusForm.controls.comments.value,
          "uid": this.common.userid,
          "time": this.dataLoadStatusForm.controls.time.value
        }
      }
      else {
        obj = {
          "action": this.action,
          "id": this.loadStatusId
        }
      }
      this.api.postMethod1('xpert/LoadStatusAction', obj).subscribe((res: any) => {
        if (res.status == 200) {
          let message = this.action == 'A' ? 'Data load status added successfully' :
            (this.action == 'U' ? 'Data load status updated successfully' : 'Data load status deleted successfully');
          this.action == 'D' ? this.modalRef.close() : '';
          this.toastr.success(message);
          this.reset();
          this.action = 'A';
          this.spinner = false;
          this.dealer = "";
          this.loadStatusData = 0;
          this.selectDate = new Date()
          this.getDataLoads();
        }
        else {
          this.toastr.success('Unable to process your request. Please try again');
          this.spinner = false;
          this.reset();
          this.dealer = "";
          this.selectDate = new Date();
          this.getDataLoads();
        }
      })
    }
  }

  cancelClick() {
    this.reset();
  }

  reset() {
    this.submitted = false;
    this.gridForm = this.action == 'D' ? true : !this.gridForm;
    this.dataLoadStatusForm.controls.client.setValue('');
    this.dataLoadStatusForm.controls.cdk.setValue('');
    this.dataLoadStatusForm.controls.reynolds.setValue('');
    this.dataLoadStatusForm.controls.driveCentric.setValue('');
    this.dataLoadStatusForm.controls.vAuto.setValue('');
    this.dataLoadStatusForm.controls.dealerFX.setValue('');
    this.dataLoadStatusForm.controls.comments.setValue('');
    this.dataLoadStatusForm.controls.counts.setValue('');
    this.dataLoadStatusForm.controls.addDate.setValue('');
    this.dataLoadStatusForm.controls.time.setValue('');
  }
}

