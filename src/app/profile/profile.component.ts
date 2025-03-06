import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { common } from '../common'
import { ApiService } from '../providers/api.service';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../tasq/dashboard/dashboard.component';
import { CreatetaskComponent } from '../tasq/createtask/createtask.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  // show Profile Data
  profileData: any;
  imageUrl = environment.xpertProfileImg;

  startDate: Date | any;
  endDate: Date | any;
  ShiftScheduleData: any = []

  shiftForm: FormGroup | any;
  ddlShiftsArray: any = [];
  showStartEndTimeDiv: boolean = false;
  shiftType: boolean = false;
  shiftHoursObj: any;
  from: any;
  to: any;
  popupMsg: any;

  startTimeArray = [
    { value: '01:00', name: '01:00' },
    { value: '02:00', name: '02:00' },
    { value: '03:00', name: '03:00' },
    { value: '04:00', name: '04:00' },
    { value: '05:00', name: '05:00' },
    { value: '06:00', name: '06:00' },
    { value: '07:00', name: '07:00' },
    { value: '08:00', name: '08:00' },
    { value: '09:00', name: '09:00' },
    { value: '10:00', name: '10:00' },
    { value: '11:00', name: '11:00' },
    { value: '12:00', name: '12:00' },
  ]

  endTimeArray = [
    { value: '01:00', name: '01:00' },
    { value: '02:00', name: '02:00' },
    { value: '03:00', name: '03:00' },
    { value: '04:00', name: '04:00' },
    { value: '05:00', name: '05:00' },
    { value: '06:00', name: '06:00' },
    { value: '07:00', name: '07:00' },
    { value: '08:00', name: '08:00' },
    { value: '09:00', name: '09:00' },
    { value: '10:00', name: '10:00' },
    { value: '11:00', name: '11:00' },
    { value: '12:00', name: '12:00' },
  ]

  teamStatus : any =[
    {id : 1, status : 'Online'},
    {id : 6, status : 'Offline'},
    {id : 9, status : 'Vacation'},
    {id : 0, status : 'View All'},
  ]
  selectedStatus : any = 1;
  tasks: any = [];

  @ViewChild('confirm') openConfirmDialog: ElementRef | undefined;
  @ViewChild('editProfileModal') editProfileModal: ElementRef | undefined;
  constructor(private common: common, private api: ApiService, private modalService: NgbModal,
    private datePipe: DatePipe, private fb: FormBuilder, private toastr: ToastrService) {

    this.shiftForm = this.fb.group({
      txtdate: [''],
      ddlshift: [0],
      ddlshiftFrom: [0],
      ddlshiftFromAm: [0],
      ddlshiftTo: [0],
      ddlshiftToAm: [0]

    })
  }

  ngOnInit(): void {
    this.getLoginUserData();
    this.calculateStartWeekDates(new Date());
    this.bindShifts();
    this.selectStatus();
    this.toggleDiv(1);
  }

  getLoginUserData() {
    const obj ={
      "id" : this.common.userid
    }
    this.api.postMethod1('users/getUserDetails',obj).subscribe((res: any) => {
      if (res.status == 200) {
        this.profileData = res.response.UserTasksInfo[0].UserInfo[0];
        console.log(this.imageUrl,this.profileData);
        
         this.tasks = res.response.UserTasksInfo[0].Task;
      }

    })
  }

  getSchedule(uid: any, date: any) {

    const obj = {
      'userid': uid,
      'date': date
    }
    this.api.postmethod('Schedule/GetSchedule', obj).subscribe(res => {
      if (res.StatusCode == 200) {
        this.ShiftScheduleData = res.Schedule;
      }
    });
  }



  date: any;
  calculateStartWeekDates(referenceDate: Date): void {
    this.date = "";
    const dayOfWeek = referenceDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diffToMonday = referenceDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
    this.startDate = new Date(referenceDate.setDate(diffToMonday));
    this.date = this.datePipe.transform(this.startDate, 'MM/dd/yyyy');
    this.endDate = new Date(this.startDate);
    this.getSchedule(this.common.userid, this.date)
    this.endDate.setDate(this.startDate.getDate() + 6);
  }

  calculateEndWeekDates(referenceDate: Date): void {
    const dayOfWeek = referenceDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diffToMonday = referenceDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
    this.startDate = new Date(referenceDate.setDate(diffToMonday));

    this.endDate = new Date(this.startDate);
    let date = this.datePipe.transform(this.endDate, 'MM/dd/yyyy');
    this.getSchedule(this.common.userid, date)
    this.endDate.setDate(this.startDate.getDate() + 6);
  }
  showNextWeek(): void {

    const nextWeekDate = new Date(this.startDate);
    nextWeekDate.setDate(this.startDate.getDate() + 7);
    this.calculateStartWeekDates(nextWeekDate);
  }

  showPreviousWeek(): void {
    const nextWeekDate = new Date(this.startDate);
    nextWeekDate.setDate(this.startDate.getDate() - 7);
    this.calculateEndWeekDates(nextWeekDate);
  }

  bindShifts() {
    const obj = {
      "expression": ""
    }
    this.api.postmethod('UserManagement/BindShifts', obj).subscribe((res: any) => {
      if (res.statuscode == 200) {
        this.ddlShiftsArray = res.schedule;
      }
      else {
        this.ddlShiftsArray = []
      }

    })
  }
  selectedTime: any;
  shiftSelect(e: any) {
    if (this.shiftForm.controls.ddlshift.value == 'custom') {
      this.showStartEndTimeDiv = true;
      this.shiftType = false;
    }
    else {
      this.showStartEndTimeDiv = false;
      this.shiftType = false;
    }
  }

  shiftTypeCheck(e: any) {
    if (e.target.checked) {
      this.shiftType = true;
      this.shiftForm.controls.ddlshift.setValue(0);
      this.shiftForm.controls.ddlshiftFrom.setValue(0);
      this.shiftForm.controls.ddlshiftFromAm.setValue(0);
      this.shiftForm.controls.ddlshiftTo.setValue(0);
      this.shiftForm.controls.ddlshiftToAm.setValue(0);
      this.showStartEndTimeDiv = false;
    }
    else {
      this.shiftType = false
    }
  }

  editShiftDetails(data: any) {
    this.shiftForm.controls.txtdate.setValue(data.Dates);
    let stime: any;
    let etime: any;

    if (data.Types != "Off") {
      if (data.shiftval != 0 || data.shiftval == "") {
        this.shiftType = false;
        if (data.shiftval == '') {
          this.showStartEndTimeDiv = true;
          stime = data.StartTimes.split(' ');
          etime = data.EndTimes.split(' ');
          this.shiftForm.controls.ddlshift.setValue('custom')
          this.shiftForm.controls.ddlshiftFrom.setValue(stime[0]);
          this.shiftForm.controls.ddlshiftFromAm.setValue(stime[1]);
          this.shiftForm.controls.ddlshiftTo.setValue(etime[0]);
          this.shiftForm.controls.ddlshiftToAm.setValue(etime[1]);
        }
        else {
          this.showStartEndTimeDiv = false;
          this.shiftForm.controls.ddlshift.setValue(data.shiftval);
          this.shiftForm.controls.ddlshiftFrom.setValue(0);
          this.shiftForm.controls.ddlshiftFromAm.setValue(0);
          this.shiftForm.controls.ddlshiftTo.setValue(0);
          this.shiftForm.controls.ddlshiftToAm.setValue(0);
        }
      }
      else {
        this.shiftForm.controls.ddlshift.setValue(0);
        this.shiftForm.controls.ddlshiftFrom.setValue(0);
        this.shiftForm.controls.ddlshiftFromAm.setValue(0);
        this.shiftForm.controls.ddlshiftTo.setValue(0);
        this.shiftForm.controls.ddlshiftToAm.setValue(0);
        this.shiftType = true;
      }
    }
    else {
      this.shiftForm.controls.ddlshift.setValue(0);
      this.shiftForm.controls.ddlshiftFrom.setValue(0);
      this.shiftForm.controls.ddlshiftFromAm.setValue(0);
      this.shiftForm.controls.ddlshiftTo.setValue(0);
      this.shiftForm.controls.ddlshiftToAm.setValue(0);
      this.showStartEndTimeDiv = false;
      this.shiftType = true;
    }

  }


  updateShiftHours(dropdown: HTMLSelectElement) {
    this.shiftHoursObj = "";
    this.from = "";
    this.to = "";
    const selectedIndex = dropdown.selectedIndex;
    const selectedOptionText = dropdown.options[selectedIndex].text;
    this.selectedTime = selectedOptionText;

    if (this.shiftType == false) {
      if (this.shiftForm.controls.ddlshift.value == 0) {
        this.toastr.warning("Please select shift")
      }
      else {

        if (this.shiftForm.controls.ddlshift.value == "custom") {

          if (this.shiftForm.controls.ddlshiftFrom.value == 0) {
            this.toastr.warning("Please select start time")
          }
          else if (this.shiftForm.controls.ddlshiftFromAm.value == 0) {
            this.toastr.warning("Please select AM/PM from start time")
          }

          else if (this.shiftForm.controls.ddlshiftTo.value == 0) {
            this.toastr.warning("Please select end time")
          }
          else if (this.shiftForm.controls.ddlshiftToAm.value == 0) {
            this.toastr.warning("Please select AM/PM from end time")
          }

          else if (this.shiftForm.controls.ddlshiftFrom.value == this.shiftForm.controls.ddlshiftTo.value) {
            if (this.shiftForm.controls.ddlshiftFromAm.value == this.shiftForm.controls.ddlshiftToAm.value) {
              // alert()
            }
          }
          else {

            this.from = this.shiftForm.controls.ddlshiftFrom.value + ' ' + this.shiftForm.controls.ddlshiftFromAm.value
            this.to = this.shiftForm.controls.ddlshiftTo.value + ' ' + this.shiftForm.controls.ddlshiftToAm.value

            this.shiftHoursObj = {
              'ShiftDataInfo': [{
                'Id': 0,
                'Touserid': this.common.userid,
                'Date': this.shiftForm.controls.txtdate.value,
                'Fromhr': this.from,
                'Tohr': this.to,
                'Createduserid': this.common.userid,
                'Status': 'Y'
              }],
              'action': 'A'
            }
          }

        }
        else {

          this.from = this.selectedTime.slice(10, 18);
          this.to = this.selectedTime.slice(19, 27);

          this.shiftHoursObj = {
            'ShiftDataInfo': [{
              'Id': 0,
              'Touserid': this.common.userid,
              'Date': this.shiftForm.controls.txtdate.value,
              'Fromhr': this.from,
              'Tohr': this.to,
              'Createduserid': this.common.userid,
              'Status': 'Y'
            }],
            'action': 'A'
          }

        }
      }
    }
    else {
      this.shiftHoursObj = {
        'ShiftDataInfo': [{
          'Id': 0,
          'Touserid': this.common.userid,
          'Date': this.shiftForm.controls.txtdate.value,
          'Fromhr': this.from,
          'Tohr': this.to,
          'Createduserid': this.common.userid,
          'Status': 'Y'
        }],
        'action': 'A'
      }
    }
    this.api.postmethod('Schedule/ShiftAction', this.shiftHoursObj).subscribe((res: any) => {
      if (res.StatusCode == 200) {
        this.toastr.success('Shift updated successfully')
        this.editProfileModal?.nativeElement.click();
        this.getSchedule(this.common.userid, this.date);
      }
      // else{
      //   this.toastr.error('Unable process your request. please try again')
      //   this.editProfileModal?.nativeElement.click();
      // }

    })

  }

  activeSection: number | null = null;

  // Toggle the accordion section
  toggleDiv(section: number) {
    if (this.activeSection === section) {
      this.activeSection = null;  // Close if the same section is clicked again
    } else {
      this.activeSection = section;
    }
  }

  // Check if the section is open
  isOpen(section: number): boolean {
    return this.activeSection === section;
  }
  onofusers : any =[]
  selectStatus(){
    
    const obj={"statusType":this.selectedStatus};
    this.api.postMethod1('users/GetOnlineUsers',obj).subscribe((res: any) => {   
      this.onofusers = res.response.filter((itm: any) => itm.u_uid != this.common.userid);   
    });
  }

  viewTaskData: any;
  opacity: any = 'Y';

  viewHitList(e: any) {
    // this.isLoading = true;

    this.opacity = 'Y';
    const obj = { "TaskId": e.Id, "UserID": this.common.userid }
    this.api.postmethod('TaskManagement/GetTaskFeedByTaskId', obj).subscribe((res: any) => {
      if (res.UserTasksInfo) {
        this.viewTaskData = res.UserTasksInfo[0];
        // this.isLoading = false;

      }
      // this.api.setHitlistData(res.UserTasksInfo[0])
    })
  }

  LocalTimeConvertioninHours(DateTime: any) {
    var utcDate = moment.utc(DateTime);
    var dateWithTimezone = utcDate.local().format('MM.DD.YY');
    return dateWithTimezone;

  }

  openFirstModal() {
    this.modalService.open(CreatetaskComponent, {
      size: 'xl', // Large modal
      backdrop: 'static', // Prevent closing on outside click
      centered: true, // Centered modal
    });
  }


}
