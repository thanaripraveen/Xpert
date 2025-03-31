import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';

@Component({
  selector: 'app-cmsmodules',
  templateUrl: './cmsmodules.component.html',
  styleUrl: './cmsmodules.component.scss'
})
export class CmsmodulesComponent implements OnInit {
  spinner: boolean = false;
  gridForm: boolean = true;
  parentModulesList: any = [];

  parentModName: any = "";
  parentModSequence: any = "";
  parentModStatus: any = "Y";
  parentModAction: any = "A";
  parentModId: any = 0;

  subModuleForm : boolean = false;
  subModulesList : any =[]
  subModAction : any ="A";
  parentInSubModName : any = "";
  subModName : any ="";
  subModFileName : any ="";
  subModCompName : any ="";
  subModSequence : any ="";
  subModStatus : boolean = true;
  constructor(private api: ApiService, private toastr: ToastrService, private common: common) { }

  ngOnInit(): void {
    this.parentModulesGrid();
  }

  addNewRole() {
    this.gridForm = !this.gridForm;
    this.subModuleForm = false;
  }

  parentModulesGrid() {
    this.spinner = true;
    const obj = {
      "ID": 0,
      "Mod_parent_id": 0,
      "expression": "",
      "rowno": 0
    }
    this.api.postMethod1('cmsmodules/GetSPModules', obj).subscribe((res: any) => {
      console.log(res);
      if (res.status == 200) {
        this.parentModulesList = res.response.filter((item: any) => item.Mod_ParentId == 0);
        this.spinner = false;
      }
      else {
        this.parentModulesList = [];
        this.spinner = false;
      }

    })
  }

  editParentModule(parentData: any) {
    this.gridForm = !this.gridForm;
    this.parentModAction = 'U';
    this.parentModName = parentData.mod_name;
    this.parentModSequence = parentData.mod_seq;
    this.parentModId = parentData.Mod_ID;
    this.parentModStatus = parentData.mod_Status == 'Y' ? true : false;
    this.subModuleGrid()
  }

  deleteParentModule(parentData: any) {

  }

  handleParentModStatus(e: any) {
    this.parentModStatus = e.target.checked == true ? 'Y' : 'N';
  }
  saveAndUpdateModule() {
    this.spinner = true;
    if (this.parentModName == "" && this.parentModSequence == "") {
      this.toastr.warning('All fields are mandatory');
      this.spinner = false;
    }
    else {
      const obj = {
        "action": this.parentModAction,
        "Mod_ID": this.parentModAction == 'A' ? 0 : this.parentModId,
        "mod_Status": this.parentModStatus == true ? 'Y' : this.parentModStatus == 'Y' ? 'Y' : 'N',
        "mod_type": "A",
        "Mod_ParentId": 1,
        "mod_seq": this.parentModSequence,
        "mod_filename": "",
        "mod_name": this.parentModName,
        "mod_component": "sdsd",
        "showcomponent": "sdsd",
        "mod_uid": this.common.userid
      }

      this.api.postMethod1('', obj).subscribe((res: any) => {
        if (res.status == 200 && this.parentModAction == 'A') {
          this.toastr.success('Module added successfully');
          this.cancelParentModule();
          this.parentModulesGrid();
          this.spinner = false;
        }
        else if (res.status == 200 && this.parentModAction == 'U') {
          this.toastr.success('Module updated successfully');
          this.cancelParentModule();
          this.parentModulesGrid();
          this.spinner = false;
        }
        else if (res.status == 200 && this.parentModAction == 'D') {
          this.toastr.success('Module deleted successfully');
          this.cancelParentModule();
          this.parentModulesGrid();
          this.spinner = false;
        }
        else {
          this.spinner = false;
          this.toastr.error('Unable to process your request.please try again')
        }
      })
    }

  }

  cancelParentModule() {
    this.gridForm = !this.gridForm;
    this.parentModName = "";
    this.parentModAction = 'A';
    this.parentModId = 0;
    this.parentModSequence = "";
    this.parentModStatus = 'Y';
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
subModuleGrid(){
  this.spinner = true;
  const obj = {
    "ID": 0,
    "Mod_parent_id": this.parentModId,
    "expression": "",
    "rowno": 0
  }
  this.api.postMethod1('cmsmodules/GetSPModules', obj).subscribe((res: any) => {
    console.log(res);
    if (res.status == 200) {
      this.subModulesList = res.response.filter((item: any) => item.Mod_ParentId == this.parentModId);
      this.spinner = false;
    }
    else {
      this.subModulesList = [];
      this.spinner = false;
    }

  })
}
  addNewSubModule(){
    this.parentModAction = 'C';
    this.subModuleForm =true;
  }

  editSubModule(subModData : any){

  }
  deleteSubModule(){

  }
  saveAndUpdateSubmodule(){

  }

  cancelSubModule(){
    this.parentModAction = 'U';
    this.subModuleForm = false;
  }
}
