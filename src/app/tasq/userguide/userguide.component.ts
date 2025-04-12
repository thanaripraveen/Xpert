import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { common } from '../../common';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-userguide',
  templateUrl: './userguide.component.html',
  styleUrl: './userguide.component.scss',

})
export class UserguideComponent implements OnInit {
  init: EditorComponent['init'] = {
    apiKey: 'c5ggiwdqs01mssapsskecr3vxbzkum3pkt47dtwv7nyzkia4',
    plugins: 'lists link image table code help wordcount',
    base_url: '/tinymce', // Root for resources
    suffix: '.min',
    height: '20rem',
    setup: (editor) => {
      editor.on('init', () => {
        const container = editor.editorContainer;
        if (this.submitted && this.userGuideFormPage.controls.description.errors) {
          container.classList.add('invalid-border');
        }
        
      });
    }
  };


  spinner: boolean = false;
  gridForm: boolean = true;
  dealer: any = 0;
  dealersData: any = [];
  getHelpData: any = [];
  userGuideFormPage: FormGroup | any;
  status: boolean = true;
  action: any = 'A';
  submitted: boolean = false;
  constructor(private api: ApiService, private common: common, private fb: FormBuilder, private toastr : ToastrService) {
    this.userGuideFormPage = this.fb.group({
      title: ['', [Validators.required]],
      code: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    this.bindDealerData();
  }

  bindDealerData() {
    const obj = {
      "searchstring": this.dealer,
      "userId": this.common.userid
    }
    this.api.postMethod1('users/GetAutoCompleteDealersData', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.dealersData = res.response;
        this.dealer = this.dealersData[0].dealer_id;
        this.getHelpXpertData();
      }
      else {
        this.dealersData = [];
      }
    })
  }

  changeDealer() {
    this.getHelpXpertData();
  }

  addNewRole() {
    this.gridForm = !this.gridForm;
    this.submitted = false;
  }

  getHelpXpertData() {
    this.spinner = true;
    const obj = {
      "id": this.dealer
    }
    this.api.postMethod1('xpert/GetXpertHelp', obj).subscribe((res: any) => {
      if (res.status == 200 && res.response.length > 0) {
        this.getHelpData = res.response;
        this.spinner = false;
      }
      else {
        this.getHelpData = [];
        this.spinner = false;
      }

    })
  }

  editHelpData(userguideData: any,) {
    this.gridForm = !this.gridForm;
    this.action = 'U';
    this.editId = userguideData.id;
    this.userGuideFormPage.controls.title.setValue(userguideData.title)
    this.userGuideFormPage.controls.code.setValue(userguideData.code)
    this.userGuideFormPage.controls.description.setValue(userguideData.description);
    this.status = userguideData.status == 'Y' ? true : false;
    
  }
  editId: any = ""
  submitClick() {
    if (this.userGuideFormPage.invalid) {
      this.submitted = true;
    }
    
    else {
      const formData = new FormData();

      formData.append('action', this.action);
      formData.append('id', this.action == 'A' ? 0 : this.editId);
      formData.append('dealerid', this.dealer);
      formData.append('code', this.userGuideFormPage.controls.code.value);
      formData.append('title', this.userGuideFormPage.controls.title.value);
      formData.append('subtitle', '');
      formData.append('description', this.userGuideFormPage.controls.description.value);
      formData.append('userid', this.common.userid);
      formData.append('status', this.action == 'A' ? 'Y' : (this.status == true ? 'Y' : 'N'))

      this.api.postMethod1('xpert/axelHelpAction', formData).subscribe((res: any)=>{
        if(res.status == 200){
        let msg = this.action == 'A' ? 'Submitted successfully' : 'Updated successfully'
        this.toastr.success(msg);
       this.reset();
        this.getHelpXpertData();
        }
        else{
          this.toastr.error('Unabke process your request. please try again ')
          this.reset();
        }
      })
    }

  }

  reset() {
    this.userGuideFormPage.reset();
    this.action= 'A';
    this.spinner = false;
    this.gridForm = !this.gridForm;
    this.submitted = false;
  }

  handleStatus(e: any) {
    this.status = e.target.checked;
  }

}
