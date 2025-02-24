import { Injectable,NgZone,OnDestroy   } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { common } from '../common'

let httpOptions: any;

// httpOptions = {
//   headers: new HttpHeaders({
//     "Access-Control-Allow-Origin": "*",
//     "content-type": "application/json,application/pdf,multipart/form-data;",
//   })
// }

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnDestroy {

  private inactivityTimeout: any;
  private readonly INACTIVITY_TIME = 120000; // 1 minute
  public userStatus$: Subject<boolean> = new Subject<boolean>();

  public editTaskData = new BehaviorSubject<any>('');
  public allTaskFilterData = new BehaviorSubject<any>('');
  public redirectUrl = new BehaviorSubject<any>('');
  public changeSidebarLink = new BehaviorSubject<any>('');
  public hitListData = new BehaviorSubject<any>('');

  private firstComponentVisibility = new BehaviorSubject<boolean>(true);
  private secondComponentVisibility = new BehaviorSubject<boolean>(true);
  //private thiredComponentVisibility = new BehaviorSubject<boolean>(true);

  isFirstVisible$ = this.firstComponentVisibility.asObservable();
  isSecondVisible$ = this.secondComponentVisibility.asObservable();
  //isThiredVisible$ = this.thiredComponentVisibility.asObservable();
  public taskUpdateValue = new BehaviorSubject<any>({data : '' , updateValue : ''});

  constructor(private http: HttpClient, private common: common,private ngZone: NgZone) {
    this.setupActivityListeners();

  }

  postmethod(endpoint: string, obj: object): Observable<any> {
  
    return this.http.post(`${environment.xpertdataurl}${endpoint}`, obj)
      .pipe(map(
        (res: any) => {
          //// console.log(res);

          return res;
        }));
  }
  postmethod1(endpoint: string, obj: object): Observable<any> {
  
    return this.http.post(`${environment.xpertNodeApi}${endpoint}`, obj)
      .pipe(map(
        (res: any) => {
          //// console.log(res);

          return res;
        }));
  }


  putmethod(endpoint: string, obj: object): Observable<any> {
    return this.http.put(`${environment.xpertdataurl}${endpoint}`, obj)
      .pipe(map(
        (res: any) => {
          return res;
        }));
  }

  getmethod(endpoint: string, obj: object): Observable<any> {
    return this.http.get(`${environment.xpertdataurl}${endpoint}`, obj)
      .pipe(map(
        (res: any) => {
          return res;
        }));
  }

  deletemethod(endpoint: string, obj: object): Observable<any> {
    return this.http.request('delete', `${environment.xpertdataurl}${endpoint}`, { body: obj })
      .pipe(map(
        (res: any) => {
          return res;
        }));
  }

  getalldata(endpoint: string, obj: object): Observable<any> {
    return this.http.post(`${environment.xpertdataurl}${endpoint}`, obj)
      .pipe(map((res: any) => {
        return res;
      }))
  }

  getLoginUserData(userId: number): Observable<any> {
    // alert(typeof userId)
    return this.http.post<any>(`${environment.xpertdataurl}Login/GetLoginUserData?userId=` + userId.toString(), httpOptions);
  }

  getSuggestedTags(ids: any, UID: number): Observable<any> {
    return this.http.post<any>(`${environment.xpertdataurl}TaskManagement/GetSuggetedTags?exp=${ids}&UserID=${UID}`, httpOptions);
  }

  getUserDetails(UID: number): Observable<any> {
    return this.http.post<any>(`${environment.xpertdataurl}Team/getUserDetails?UserID=${UID}`, httpOptions);
  }

  usersignout(userId: number): Observable<any> {
    return this.http.post<any>(`${environment.xpertdataurl}Login/LogOut?userId=` + userId.toString(), httpOptions);
  }

  getSidebarListService(endpoint: any, obj: any) {
    return this.http.post(`${environment.xpertdataurl}${endpoint}`, obj)
  }


  post(endpoint: any, obj: any) {
    return this.http.post(`${environment.xpertdataurl}${endpoint}`, obj, { headers })
  }


  createTask(endpoint: any, data: any): Observable<any> {
    const formData = new FormData();
    formData.append('Action', data.Action);
    formData.append('AppSupportTask', JSON.stringify(data.AppSupportTask));
    formData.append('TitleIds', JSON.stringify(data.TitleIds));

    // If you have a file to upload, append it to the FormData object
    if (data.AppSupportTask[0].file) {
      formData.append('file', data.AppSupportTask[0].file);
    }
    formData.forEach((value, key) => {
      // console.log(`${key}: ${value}`);
    });
    return this.http.post(`${environment.xpertdataurl}${endpoint}`, formData);
  }
  setEditTaskData(data: any) {
    this.editTaskData.next(data);
  }
  getEditTaskData() : Observable<any> {
    return this.editTaskData.asObservable()
  }

  bindSubGrid(id: any) {
    return this.http.post<any>(`${environment.xpertdataurl}Users/BindSubGrid?ID=` + id, httpOptions)
  }

  bindModules(mName: any) {
    return this.http.post<any>(`${environment.xpertdataurl}Users/BindSelect?n=` + mName, httpOptions)
  }
  deleteMainModule(id: any) {
    return this.http.post<any>(`${environment.xpertdataurl}Users/DeleteData?ID=` + id, httpOptions)
  }
  deleteSubModule(data: any) {
    return this.http.post<any>(`${environment.xpertdataurl}Users/DeleteSubData?ID=${data.Identifier}&PID=${data.ModParentId}`, httpOptions)
  }


  bindStatesList(country: any) {
    return this.http.post<any>(`${environment.xpertdataurl}UserManagement/BindStates?country=` + country, httpOptions)
  }

  redirectRouteFrom(url: any) {
    this.redirectUrl.next(url);
  }
  getredirectRouteFrom() {
    return this.redirectUrl.asObservable()
  }


  getsave(endpoint: string, obj: object): Observable<any> {
    return this.http.post(`${environment.xpertdataurl}${endpoint}`, obj)
      .pipe(map((res: any) => {
        return res;
      }))
  }

  dateofjoin(endpoint: string, obj: object): Observable<any> {
    return this.http.post(`${environment.xpertdataurl}${endpoint}`, obj)
      .pipe(map(
        (res: any) => {
          return res;
        }));
  }

  bindRoles(endPoint: any, val: any) {
    return this.http.post(`${environment.xpertdataurl}${endPoint}`, val)
  }

  setChangeSideBarData(data: any) {
    this.changeSidebarLink.next(data);
  }
  getChangeSideBarData() {
    return this.changeSidebarLink.asObservable();
  }

  getActiveUsers(id: any) {
    return this.http.get<any>(`${environment.xpertdataurl}Team/Getonlineusersnew?typeid=` + id, httpOptions)
  }

  setupActivityListeners() {
        window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
        window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
        window.addEventListener('mousedown', this.resetInactivityTimer.bind(this));
        // Initially start the timer
        this.resetInactivityTimer();
  }

  resetInactivityTimer = this.debounce(() =>{
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }

    
    let d: any = localStorage.getItem('userData')
    if (d != null) {
      // console.log(d);
      
      d = JSON.parse(d);
      // if(d.profilestatus != 'Online'){
      //   this.userStatus$.next(true); // User is online
      // }
      if (d.profilestatus == 'Online') {
        this.inactivityTimeout = setTimeout(() => {
          this.ngZone.run(() => {
            this.userStatus$.next(false); // User is offline (inactive)
            // console.log('User is considered offline due to inactivity');
          });
        }, this.INACTIVITY_TIME);
      }
    }
  },300)
 

  debounce(func: Function, wait: number) {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  ngOnDestroy() {
    window.removeEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.removeEventListener('keydown', this.resetInactivityTimer.bind(this));
    window.removeEventListener('mousedown', this.resetInactivityTimer.bind(this));
  
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
    }
  }

  getNotes(gId: any) {
    return this.http.post<any>(`${environment.xpertdataurl}TaskManagement/GetXpertUserNotes?GroupId=` + gId, httpOptions)
  }

  acknowledgeApi(ticktId : any,loginId: any,Title:any,Details:any,ReqUserEmail:any) {
    return this.http.post<any>(`${environment.xpertdataurl}TaskManagement/AcknowledgeSupportTask?TicketID=${ticktId}&LoginId=${loginId}&Title=${Title}&Details=${Details}&ReqUserEmail=${ReqUserEmail}`,httpOptions)
  }

  releaseNotication(obj: any){
    return this.http.post<any>('https://commsapi.axelautomotive.com/api/Communications/sendNotification',obj)
  }

  changePriority(endpoint:any,obj : any){
    return this.http.post<any>(environment.xpertNodeApi + endpoint,obj)
  }
 
  changeTicketType(endpoint:any,obj : any){
    return this.http.post<any>(environment.xpertNodeApi + endpoint,obj)
  }

  getTagsMethod(endpoint : any , obj : any){
    return this.http.post<any>(environment.xpertNodeApi + endpoint,obj);
 
  }
  postMethod1(endpoint : any , obj : any){
    return this.http.post<any>(environment.xpertNodeApi + endpoint,obj);
  }

  setFilterData(data : any){
    this.allTaskFilterData.next(data);
  }
  getAllTaskFilterData(){
    return this.allTaskFilterData.asObservable();
  }

  toggleFirstVisibility() {
    this.firstComponentVisibility.next(!this.firstComponentVisibility.value);
  }

  toggleSecondVisibility() {
    this.secondComponentVisibility.next(!this.secondComponentVisibility.value);
  }

  // toggleThiredVisibility() {
  //   this.thiredComponentVisibility.next(!this.thiredComponentVisibility.value);
  // }

  resetVisibilityStates() {
    this.firstComponentVisibility.next(true);
    this.secondComponentVisibility.next(true);
  //  this.thiredComponentVisibility.next(true);
  }


  GetEditProfile(uid: number): Observable<any> {
    return this.http.post<any>(`${environment.xpertdataurl}UserManagement/Edit?uid=${uid}`, httpOptions);
  }

  setUpdateTaskValue(value : any){
    this.taskUpdateValue.next(value)
  }
 
  getUpdateTaskValue(){
   return this.taskUpdateValue.asObservable()
  }


  menuData  = [
    {
        "Identifier": 7,
        "ModSequence": 1,
        "UID": 77,
        "ModuleName": "Leads",
        "FileName": "Leads",
        "Status": null,
        "ModParentId": 2,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "LeadListPage",
        "ShowComponent": "Y",
        "compstats": "N"
    },
    {
        "Identifier": 8,
        "ModSequence": 1,
        "UID": 77,
        "ModuleName": "Team Roster",
        "FileName": "Team",
        "Status": null,
        "ModParentId": 3,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "RosterPage",
        "ShowComponent": "Y",
        "compstats": "N"
    },
    {
        "Identifier": 1,
        "ModSequence": 1,
        "UID": 77,
        "ModuleName": "Tickets",
        "FileName": "",
        "Status": null,
        "ModParentId": 0,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 14,
        "ModSequence": 1,
        "UID": 3,
        "ModuleName": "Users",
        "FileName": "admusers",
        "Status": null,
        "ModParentId": 5,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "",
        "ShowComponent": null,
        "compstats": "N"
    },
    {
        "Identifier": 36,
        "ModSequence": 1,
        "UID": 77,
        "ModuleName": "Template Category",
        "FileName": "TemplateCategory",
        "Status": null,
        "ModParentId": 4,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "N",
        "ShowComponent": "No",
        "compstats": "N"
    },
    {
        "Identifier": 31,
        "ModSequence": 1,
        "UID": 3,
        "ModuleName": "Fuel Price",
        "FileName": "fuelprice",
        "Status": null,
        "ModParentId": 30,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "",
        "ShowComponent": null,
        "compstats": "N"
    },
    {
        "Identifier": 51,
        "ModSequence": 1,
        "UID": 77,
        "ModuleName": "TASQ Messenger",
        "FileName": "Messenger",
        "Status": null,
        "ModParentId": 48,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "MessengerListPage",
        "ShowComponent": "Y",
        "compstats": "N"
    },
    {
        "Identifier": 74,
        "ModSequence": 1,
        "UID": 77,
        "ModuleName": "Store Setup",
        "FileName": "storesetup",
        "Status": null,
        "ModParentId": 33,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 24,
        "ModSequence": 1,
        "UID": 3,
        "ModuleName": "Accounts Dashboard",
        "FileName": "AccountsDashboard",
        "Status": null,
        "ModParentId": 23,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 64,
        "ModSequence": 1,
        "UID": 77,
        "ModuleName": "Tags",
        "FileName": "tags",
        "Status": null,
        "ModParentId": 63,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 25,
        "ModSequence": 2,
        "UID": 77,
        "ModuleName": "Invoice Setup",
        "FileName": "DealerInvoiceSetup",
        "Status": null,
        "ModParentId": 23,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "",
        "ShowComponent": null,
        "compstats": "N"
    },
    {
        "Identifier": 75,
        "ModSequence": 2,
        "UID": 77,
        "ModuleName": "New User Request",
        "FileName": "newuserrequest",
        "Status": null,
        "ModParentId": 33,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 13,
        "ModSequence": 2,
        "UID": 3,
        "ModuleName": "CMS Modules",
        "FileName": "Cmsmodules",
        "Status": null,
        "ModParentId": 5,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "",
        "ShowComponent": null,
        "compstats": "N"
    },
    {
        "Identifier": 32,
        "ModSequence": 2,
        "UID": 3,
        "ModuleName": "Dealer Fuel Price",
        "FileName": "dealerfuelprice",
        "Status": null,
        "ModParentId": 30,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "",
        "ShowComponent": null,
        "compstats": "N"
    },
    {
        "Identifier": 43,
        "ModSequence": 2,
        "UID": 77,
        "ModuleName": "All Tickets",
        "FileName": "Alltasks",
        "Status": null,
        "ModParentId": 1,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 49,
        "ModSequence": 2,
        "UID": 77,
        "ModuleName": "MessengerGroups",
        "FileName": "MessengerGroup",
        "Status": null,
        "ModParentId": 48,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 9,
        "ModSequence": 2,
        "UID": 77,
        "ModuleName": "User Status",
        "FileName": "UserStatusType",
        "Status": null,
        "ModParentId": 4,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 20,
        "ModSequence": 2,
        "UID": 77,
        "ModuleName": "DMS",
        "FileName": "",
        "Status": null,
        "ModParentId": 0,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 11,
        "ModSequence": 3,
        "UID": 3,
        "ModuleName": "Tags",
        "FileName": "Tags",
        "Status": null,
        "ModParentId": 4,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "",
        "ShowComponent": null,
        "compstats": "N"
    },
    {
        "Identifier": 15,
        "ModSequence": 3,
        "UID": 3,
        "ModuleName": "Permissions",
        "FileName": "Permissions",
        "Status": null,
        "ModParentId": 5,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "",
        "ShowComponent": null,
        "compstats": "N"
    },
    {
        "Identifier": 27,
        "ModSequence": 3,
        "UID": 77,
        "ModuleName": "NUC",
        "FileName": "NucData",
        "Status": null,
        "ModParentId": 4,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": "",
        "ShowComponent": null,
        "compstats": "N"
    },
    {
        "Identifier": 3,
        "ModSequence": 3,
        "UID": 77,
        "ModuleName": "Team Roster",
        "FileName": "",
        "Status": null,
        "ModParentId": 0,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 50,
        "ModSequence": 3,
        "UID": 77,
        "ModuleName": "MessengerTags",
        "FileName": "MessengerTags",
        "Status": null,
        "ModParentId": 48,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 72,
        "ModSequence": 3,
        "UID": 77,
        "ModuleName": "How Do I",
        "FileName": "howdoi",
        "Status": null,
        "ModParentId": 33,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 68,
        "ModSequence": 4,
        "UID": 77,
        "ModuleName": "User Guide",
        "FileName": "userguide",
        "Status": null,
        "ModParentId": 33,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 65,
        "ModSequence": 4,
        "UID": 77,
        "ModuleName": "Tags",
        "FileName": "tags",
        "Status": null,
        "ModParentId": 5,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 66,
        "ModSequence": 5,
        "UID": 77,
        "ModuleName": "Group Messages",
        "FileName": "groupmessages",
        "Status": null,
        "ModParentId": 33,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 73,
        "ModSequence": 5,
        "UID": 77,
        "ModuleName": "Roles",
        "FileName": "roles",
        "Status": null,
        "ModParentId": 5,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 55,
        "ModSequence": 5,
        "UID": 77,
        "ModuleName": "Version",
        "FileName": "Version",
        "Status": null,
        "ModParentId": 4,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 62,
        "ModSequence": 6,
        "UID": 77,
        "ModuleName": "Release Notes",
        "FileName": "releasenotes",
        "Status": null,
        "ModParentId": 33,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 5,
        "ModSequence": 6,
        "UID": 236,
        "ModuleName": "Administration",
        "FileName": "",
        "Status": null,
        "ModParentId": 0,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 33,
        "ModSequence": 7,
        "UID": 77,
        "ModuleName": "Dealer",
        "FileName": "",
        "Status": null,
        "ModParentId": 0,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 76,
        "ModSequence": 7,
        "UID": 77,
        "ModuleName": "Users Status",
        "FileName": "usersstatus",
        "Status": null,
        "ModParentId": 5,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 67,
        "ModSequence": 9,
        "UID": 77,
        "ModuleName": "Dashboard",
        "FileName": "dashboard",
        "Status": null,
        "ModParentId": 1,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 77,
        "ModSequence": 12,
        "UID": 77,
        "ModuleName": "My Tickets",
        "FileName": "mytickets",
        "Status": null,
        "ModParentId": 1,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    },
    {
        "Identifier": 69,
        "ModSequence": 12,
        "UID": 77,
        "ModuleName": "Data Loads",
        "FileName": "loadstatus",
        "Status": null,
        "ModParentId": 20,
        "ModType": "A",
        "StatusType": "Y",
        "platform": null,
        "Component": " ",
        "ShowComponent": "N",
        "compstats": "N"
    }
]
getMenuTree() {
  let menuMap = new Map<number, any>();

  // Step 1: Initialize map with items
  this.menuData.forEach((item: any) => {
    item.children = [];
    menuMap.set(item.Identifier, item);
  });

  let menuTree = [];

  // Step 2: Build hierarchy
  this.menuData.forEach(item => {
    if (item.ModParentId === 0) {
      // Parent menu item
      menuTree.push(item);
    } else {
      // Find parent and add as a child
      let parent = menuMap.get(item.ModParentId);
      if (parent) {
        parent.children.push(item);
      }
    }
  });

  return menuTree;
}
 
 
}
