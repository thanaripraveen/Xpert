import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
  parentModStatus: boolean = true;
  parentModAction: any = "A";
  parentModId: any = 0;

  subModuleForm : boolean = false;
  subModulesList : any =[]
  subModAction : any ="A";
  parentInSubModName : any = "";
  subModName : any ="";
  subModFileName : any ="";
  subModCompName : any ="";
  showCompStatus : boolean = false;
  subModSequence : any ="";
  subModStatus : boolean = true;
  subModId : any;
  private modalRef!: NgbModalRef;

  constructor(private api: ApiService, private toastr: ToastrService, private common: common, private modalService: NgbModal) { }

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
        this.parentInSubModName = this.parentModulesList[0].Mod_ID;
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
    this.parentInSubModName = this.parentModId;
    this.parentModStatus = parentData.mod_Status == 'Y' ? true : false;
    this.subModuleGrid()
  }

  deleteParentModule(pModal: any ,parentData: any) {
    this.parentModAction = 'D';
    this.parentModId = parentData.Mod_ID;
    this.parentModName = parentData.mod_name;
    this.parentModSequence = parentData.mod_seq;
    this.modalRef = this.modalService.open(pModal, {
      windowClass: 'ackConfirmBYModal',
      size: 'sm',
      backdrop: 'static',
    })
  }

  handleParentModStatus(e: any) {
    this.parentModStatus = e.target.checked;
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
        "mod_Status": this.parentModStatus == true ? 'Y': 'N',
        "mod_type": "A",
        "Mod_ParentId": 0,
        "mod_seq": this.parentModSequence || 0,
        "mod_filename": "",
        "mod_name": this.parentModName || "",
        "mod_component": "sdsd",
        "showcomponent": "sdsd",
        "mod_uid": this.common.userid
      }

      this.api.postMethod1('cmsmodules/CMSModulesAction', obj).subscribe((res: any) => {
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
          this.modalRef.close();
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
    if(this.parentModAction != 'D'){
       this.gridForm = !this.gridForm; 
    }
    this.parentModName = "";
    this.parentModAction = 'A';
    this.parentModId = 0;
    this.parentModSequence = "";
    this.parentModStatus = true;
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
    console.log(subModData);
    this.subModAction= 'U';
    this.parentModAction = 'C';
    this.parentInSubModName = subModData.Mod_ParentId;
    this.subModId = subModData.Mod_ID;
    this.subModName = subModData.mod_name;
    this.subModFileName = subModData.mod_filename;
    this.subModSequence = subModData.mod_seq;
    this.subModCompName = subModData.mod_component;
    this.showCompStatus = subModData.mod_showcomponent == 'Y' ? true : false;
    this.subModStatus = subModData.mod_Status == 'Y' ? true : false;
    this.subModuleForm = true;
    
  }
  handleSubModStatus(e: any) {
    this.subModStatus = e.target.checked;
  }
  deleteSubModule(sModal : any , subModData: any){
    this.subModAction = 'D';
    this.subModId = subModData.Mod_ID;
    this.subModName = subModData.mod_name;
    this.subModFileName = subModData.mod_filename;
    this.subModSequence = subModData.mod_seq;
    this.subModCompName = subModData.mod_component;
    this.modalRef = this.modalService.open(sModal, {
      windowClass: 'ackConfirmBYModal',
      size: 'sm',
      backdrop: 'static',
    })
  }
  saveAndUpdateSubmodule(){
    this.spinner = true;
    if (this.subModName == "" && this.subModFileName == "" && this.subModCompName == "" && this.subModSequence == "") {
      this.toastr.warning('All fields are mandatory');
      this.spinner = false;
    }
    else {
      const obj = {
        "action": this.subModAction,
        "Mod_ID": this.subModAction == 'A' ? 0 : this.subModId,
        "mod_Status": this.subModStatus == true ? 'Y' : 'N',
        "mod_type": "A",
        "Mod_ParentId": this.parentModId,
        "mod_seq": this.subModSequence,
        "mod_filename": this.subModFileName,
        "mod_name": this.subModName,
        "mod_component": this.subModCompName,
        "showcomponent": this.showCompStatus == true ? 'Y' : 'N',
        "mod_uid": this.common.userid
      }

      this.api.postMethod1('cmsmodules/CMSModulesAction', obj).subscribe((res: any) => {
        if (res.status == 200 && this.subModAction == 'A') {
          this.toastr.success('Sub module added successfully');
         this.cancelSubModule();
         this.subModuleGrid();
          this.spinner = false;
        }
        else if (res.status == 200 && this.subModAction == 'U') {
          this.toastr.success('Sub module updated successfully');
          this.cancelSubModule();
          this.subModuleGrid();
          this.spinner = false;
        }
        else if (res.status == 200 && this.subModAction == 'D') {
          this.toastr.success('Sub module deleted successfully');
          this.modalRef.close();
          this.cancelSubModule();
          this.subModuleGrid();
          this.spinner = false;
        }
        else {
          this.spinner = false;
          this.toastr.error('Unable to process your request.please try again')
        }
      })
    }
  }

  cancelSubModule(){
    this.parentModAction = 'U';
    this.subModuleForm = false;
    this.subModName = "";
    this.subModAction = 'A';
    this.subModId = 0;
    this.subModSequence = "";
    this.subModStatus = true;
    this.subModCompName = "";
    this.subModFileName = "";
    this.showCompStatus = false;

  }
}
