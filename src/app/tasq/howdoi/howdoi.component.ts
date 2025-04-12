import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Validators } from 'ngx-editor';
import { AngularEditorComponent, AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-howdoi',
  templateUrl: './howdoi.component.html',
  styleUrl: './howdoi.component.scss'
})
export class HowdoiComponent implements OnInit {
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

  spinner: boolean = false;
  gridForm: boolean = true;
  dealer: any = 0;
  dealersData: any = [];
  FaqData: any = [];
  selectedModuleId = "";
  howDoIFormPage: FormGroup | any;
  submitted: boolean = false;
  action: any = 'A';
  editData: any = "";
  status: boolean = true;
    private modalRef!: NgbModalRef;
  
  @ViewChild(AngularEditorComponent) editorComponent!: AngularEditorComponent;
  constructor(private api: ApiService, private common: common, private fb: FormBuilder, private toastr: ToastrService,private modalService: NgbModal) {
    this.howDoIFormPage = this.fb.group({
      department: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.bindDealerData();
  }

  changeDealer() {
    this.selectedModuleId = "";
    this.getFaqData();
  }

  changeModule() {
    this.getFaqData();
  }

  addNew() {
    this.gridForm = !this.gridForm;
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
        this.getModule();
        this.getFaqData();
      }
      else {
        this.dealersData = [];
      }
    })
  }

  modulearr: any
  getModule() {
    this.api.postMethod1('xpert/GetXpertModules', "").subscribe((res: any) => {
      if (res.length !== 0) {
        this.modulearr = res.response;
      } else {
        this.modulearr = [];
      }
    });
  }

  getFaqData() {
    this.spinner = true
    const obj = {
      "storeId": this.dealer,
      "moduleId": this.selectedModuleId,
      "exp": "",
      "roleid": 0
    }
    this.api.postMethod1('xpert/GetAxelFaqbyRole', obj).subscribe((res: any) => {
      if (res.length != 0) {
        this.FaqData = res.response;
        this.spinner = false;
      }
      else {
        this.FaqData = []
        this.spinner = false;
      }
    })
  }

  updateImageStyles(description: string) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const images: any = tempDiv.getElementsByTagName('img');
    for (let img of images) {
      img.setAttribute('height', '20px');
      img.setAttribute('cursor', 'pointer');
    }
    return tempDiv.innerHTML;
  }

  adjustImages() {
    const editorElement = document.querySelector('.editor');
    if (editorElement) {
      const images = editorElement.querySelectorAll('img');
      images.forEach((img: HTMLImageElement) => {
        img.style.maxWidth = '100%';
        img.style.maxHeight = '300px';
        img.style.objectFit = 'contain';
      });
    }
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

  handleStatus(e: any) {
    this.status = e.target.checked;
  }

  editModuleData(e: any) {
    this.gridForm = !this.gridForm;
    this.editData = e;
    this.action = 'U';
    this.howDoIFormPage.controls.title.setValue(e.af_title);
    const selectedModule = this.modulearr.find(m => m.mod_name === e.module_name);
    if (selectedModule) {
      this.howDoIFormPage.controls.department.setValue(selectedModule.mod_seq); // Set the selected mod_seq
    }
    this.howDoIFormPage.controls.description.setValue(e.af_desc);
    this.status = e.af_status == 'Y' ? true : false;
    setTimeout(() => {this.adjustImages(); }, 0);
  }

  submitClick() {
    this.spinner = true;
    if (this.howDoIFormPage.invalid) {
      this.submitted = true;
      this.spinner = false;
    }
    else {
      const obj = {
        'action': this.action,
        'id': this.action == 'A' ? 0 : this.editData.af_id,
        'role': this.common.roleid,
        'title': this.howDoIFormPage.controls.title.value,
        'desc': this.howDoIFormPage.controls.description.value,
        'status': this.status == true ? 'Y' : 'N',
        'userid': this.common.userid,
        'storeid': this.dealer,
        'moduleid': this.howDoIFormPage.controls.department.value
      }
      this.api.postMethod1('xpert/AxelFaqAction', obj).subscribe((res: any) => {
        if (res.status == 200) {
          let msg = this.action == 'A' ? 'Submitted successfully' : 'Updated successfully';
          this.toastr.success(msg);
          this.reset();
        }
        else {
          this.toastr.error('Unable to process your request. please try again');
          this.reset();
        }
      })
    }
  }

  reset() {
    this.howDoIFormPage.reset();
    this.action = 'A';
    this.spinner = false;
    this.gridForm = true;
    this.getFaqData();
  }

  selectedImage: any;
  onImageClick(event: MouseEvent,content: any) {
    const target = event.target as HTMLImageElement;

    if (target && target.tagName === 'IMG') {
      this.selectedImage = target.src
      this.modalRef =  this.modalService.open(content,{
        windowClass: 'screenshotModal',
          size: 'xl', 
          backdrop: 'static',
      })
    }
  }



}
