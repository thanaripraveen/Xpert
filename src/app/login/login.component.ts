import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ApiService } from '../providers/api.service';
import { Router } from '@angular/router';
import { common } from '../common';
import { ToastrService } from 'ngx-toastr'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  submitted: boolean = false;
  // remember Check box
  remStatus : boolean = false;
  rememberUserData: any;


  constructor(private fb: FormBuilder, private api: ApiService, 
    private router: Router, private common: common,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  get f() { return this.loginForm.controls; }

  ngOnInit(): void {
    if (localStorage.getItem('rembUserDetails') != 'undefined' && localStorage.getItem('rembUserDetails') != null) {
      this.remStatus = true;
      let rembUserDetails = localStorage.getItem('rembUserDetails');
    
      if (rembUserDetails) {
          let userDetails: any = JSON.parse(rembUserDetails);
          this.loginForm.controls.email.setValue(atob(userDetails.username));
          this.loginForm.controls.password.setValue(atob(userDetails.password));
          this.router.navigateByUrl('dashboard');
      }
    }
    else{
      this.remStatus = false;
    }
  }

  signInClick() {

    if (this.loginForm.invalid) {
      this.submitted = true;
    }
    else{
      this.submitted = false;

      const obj = {
        "txtusername": this.loginForm.value.email,
        "txtpassword": this.loginForm.value.password
      }
      this.api.postmethod('Login/LoginUser',obj).subscribe((res: any)=>{
     
        if(res.returnVal == 'SUCCESS'){
          this.router.navigate(['dashboard']);
          this.common.userid = res.Identifier;
          this.common.roleid = res.RoleId;
          this.common.usertags = res.UserTags;
          this.common.token = res.Token;
          this.common.name = res.Name;
          this.common.email = res.Email;
          this.common.profileimage = res.ProfileImage;
          this.common.roles = { admin: res.Admin, front: res.Front };
          if(this.remStatus){
            this.rememberUserData = {
              username: btoa(this.loginForm.controls.email.value),
              password: btoa(this.loginForm.controls.password.value)
            }
            localStorage.setItem('rembUserDetails',JSON.stringify(this.rememberUserData))
          }
          
          this.InsertMenustatus(1, '', 'Online')
        }

        else if (res.returnVal == "ERROR") {
          localStorage.setItem('auth', '')
           this.toastr.error("Invalid User Name or Password");
        }
        
      })
    }
  }

  rememberMe(e: any) {
    if (e.target.checked) {
      this.remStatus = true;
    }
    else {
      this.remStatus = false;
      localStorage.removeItem('rembUserDetails')
    }
  }

  loadUserProfile() {
    const userId = this.common.userid
    this.api.getLoginUserData(userId).subscribe(res => {
      this.common.profilestatus = res.userstatus;
      this.common.saveUserData();

    });
  }

  InsertMenustatus(id: any, custstatus: any, name: any) {

    const userid = this.common.userid;
    const obj = {
      "loginfrom": "D",
      "ip": "",
      "typeid": id,
      "Cust_status": custstatus,
      "statusname": name,
      "loginUser_id": userid
    }
    this.api.postmethod('UserManagement/UpdateProfilestatus', obj).subscribe(res => {
      this.loadUserProfile()
    })


  }
}
