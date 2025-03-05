import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../providers/api.service';
import { environment } from '../../../environments/environment';
import { common } from '../../common';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-savedocuments',
  templateUrl: './savedocuments.component.html',
  styleUrl: './savedocuments.component.scss'
})
export class SavedocumentsComponent implements OnInit {
  spinner: boolean = false;
  ticketData: any;
  ticketDocuments: any = [];
  xpertNodefiles = environment.xpertNodefiles;
  roleId: any;
  private subscription! : Subscription;
  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(public activeModal: NgbActiveModal, private api: ApiService, private common: common, private toastr: ToastrService) {
    // this.spinner =true
    this.roleId = this.common.roleid;
  }
  ngOnInit(): void {
   this.subscription = this.api.getTicketData().subscribe((res: any) => {
      if (res) {
        this.ticketData = res;
        this.bindDocuments()
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  bindDocuments() {
    this.spinner = true;
    const obj = {
      "ticket": this.ticketData.Ticket
    }
    this.api.postMethod1('xpert/GetTaskDocuments', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.ticketDocuments = res.response.TaskDoc;
        this.spinner = false;
      }
      else {
        this.ticketDocuments = [];
        this.spinner = false;
      }
    })

  }

  getShortDocument(doc: string): string {
    return doc.length > 50 ? doc.substring(0, 50) + '...' : doc;
  }

  selectedFiles: File[] = [];
  onAttachFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  Attachment(fileInput: HTMLInputElement) {
    this.spinner = true;
    if (this.selectedFiles.length > 0) {
      const fd = new FormData();
      fd.append('ticketId', this.ticketData.Ticket)
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
        if (res.status == 200) {
          this.toastr.success('File uploaded successfully');
          this.fileInput.nativeElement.value = '';
          this.selectedFiles = []
          this.spinner = false;
          this.bindDocuments()

          const obj = {
            "TaskId": this.ticketData.ID, "UserID": this.common.userid
          }

          this.api.postMethod1('users/GetTaskViewbyId', obj).subscribe((res: any) => {
            if (res.status == 200) {
              this.api.setUpdateTaskValue({ data: res, updateValue: 1 })
              this.spinner = false;
            }
            else {
              this.spinner = false
            }

          });
        }
        else {
          this.toastr.error('Unable to process your request. Please try again');
          this.spinner = false;

        }

      })

    }
    else {
      this.toastr.warning('Please upload file')
      this.spinner = false;

    }
  }

  deleteDocument(docData: any) {

    const obj = {
      "id": docData.ID,
      "uid": this.common.userid,
      "action": "D"
    }
    this.api.postMethod1('xpert/TaskFileUpdate', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.toastr.success('Ticket file deleted successfully');
        this.bindDocuments()
        const obj = {
          "TaskId": this.ticketData.ID, "UserID": this.common.userid
        }

        this.api.postMethod1('users/GetTaskViewbyId', obj).subscribe((res: any) => {
          if (res.status == 200) {
            this.api.setUpdateTaskValue({ data: res, updateValue: 1 })
          }
        })
      }
    })
  }

  closeModal() {
    this.fileInput.nativeElement.value = '';
    this.activeModal.close();
  }

}
