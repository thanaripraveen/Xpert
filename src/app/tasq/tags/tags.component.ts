import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service';
import { ToastrService } from 'ngx-toastr';
import { common } from '../../common';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent implements OnInit {
  spinner: boolean = false;

  buttons = [
    { label: 'Issue Tags', 'type': 'I' },
    { label: 'Severity Tags', 'type': 'V' },
    { label: 'Release Tags', 'type': 'R' },
    { label: 'Other Tags', 'type': 'S' },
    { label: 'Customer Tags', 'type': 'C' }
  ];
  selectedButton: number | null = 0;
  Tagtype: any = 'I';
  tagsDetailsData: any = []
  tagsDataList: any = [];
  gridForm: boolean = true;
  selectedTagType: any = "";
  tagName: string = '';
  action: any = 'A';
  status: any = 'Y';
  tagId: any = 0;

  constructor(private api: ApiService, private toastr: ToastrService, private common: common) { }
  ngOnInit(): void {
    this.getTags()
  }

  getTags() {
    this.spinner = true
    const obj = {
      "id": 0,
      "exp": "",
      "flag": ""
    }
    this.api.getTagsMethod('xpert/GetTags', obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.tagsDataList = res.response;
        this.tagsDetailsData = res.response;
        this.setActive(this.selectedButton, this.Tagtype)
        this.spinner = false;

      }
      else {
        this.tagsDataList = []
        this.spinner = false;

      }

    })
  }

  setActive(index: number, data: any) {

    this.selectedButton = index;
    this.Tagtype = data;
    this.tagsDataList = this.tagsDetailsData.filter((element: any) => element.tag_type == this.Tagtype)

  }

  addNewTag() {
    this.gridForm = !this.gridForm;
  }
  handleStatus(e: any) {
    this.status = e.target.checked;
  }

  editTag(e: any){
    this.spinner = true;
    this.selectedTagType = e.tag_type;
    this.action = 'U';
    this.tagName = e.Tag_Name;
    this.tagId = e.ID;
    this.status = e.Tag_Status == 'Y' ? true : false;
    this.gridForm = false;
    this.spinner = false;

  }
  saveAndUpdateTag() {
    this.spinner = true;
    if (this.tagName == "") {
      this.toastr.warning('Please enter tag name');
      this.spinner = false;

    }
    else {
      const obj = {
        "action": this.action,
        "id": this.tagId == 0 ? 0 : this.tagId,
        "tagtype": this.selectedTagType,
        "tag_name": this.tagName,
        "uid": this.common.userid,
        "status": this.action == 'A' ? 'Y' : this.status == true ? 'Y' : 'N'
      }

      this.api.postMethod1('xpert/TagsAction', obj).subscribe((res: any) => {

        if (res.status == 200 && this.action == 'A') {
          this.toastr.success('Tag added successfully')
          this.cancel()
          this.spinner = false;
          this.getTags()


        }
        else if (res.status == 200 && this.action == 'U') {
          this.toastr.success('Tag updated successfully')
          this.cancel()
          this.spinner = false;
          this.getTags()

        }
        else {
          this.toastr.error('Unable to process your request.. please try again')
          this.cancel()
          this.spinner = false;

        }
      })
    }
  }

  cancel() {
    this.tagName = '';
    this.selectedTagType = '';
    this.action = 'A';
    this.gridForm = true;
    this.tagId = 0;
  }

}
