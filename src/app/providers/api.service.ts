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
  public filterDataBasedOnStatus = new BehaviorSubject<any>({status : '' , dealerId : '', tktStatus: ''});
  public ClientsAndDealersOnStatus = new BehaviorSubject<any>({clientId:'',name:'',dealerId:''});



  private firstComponentVisibility = new BehaviorSubject<boolean>(true);
  private secondComponentVisibility = new BehaviorSubject<boolean>(true);
  //private thiredComponentVisibility = new BehaviorSubject<boolean>(true);

  isFirstVisible$ = this.firstComponentVisibility.asObservable();
  isSecondVisible$ = this.secondComponentVisibility.asObservable();
  //isThiredVisible$ = this.thiredComponentVisibility.asObservable();
  public taskUpdateValue = new BehaviorSubject<any>({data : '' , updateValue : ''});

  private ticketData = new BehaviorSubject<any>('');
  private selectUserInfo = new BehaviorSubject<any>('');
  private showHideDiv = new BehaviorSubject<any>(true);


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

  setShowHideToggleDiv(data: boolean) {
    this.showHideDiv.next(data);
  }
  getShowHideToggleDiv() : Observable<any> {
    return this.showHideDiv.asObservable()
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

  // getNotes(gId: any) {
  //   return this.http.post<any>(`${environment.xpertdataurl}TaskManagement/GetXpertUserNotes?GroupId=` + gId, httpOptions)
  // }

  // acknowledgeApi(ticktId : any,loginId: any,Title:any,Details:any,ReqUserEmail:any) {
  //   return this.http.post<any>(`${environment.xpertdataurl}TaskManagement/AcknowledgeSupportTask?TicketID=${ticktId}&LoginId=${loginId}&Title=${Title}&Details=${Details}&ReqUserEmail=${ReqUserEmail}`,httpOptions)
  // }

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


  

  setUpdateTaskValue(value : any){
    this.taskUpdateValue.next(value)
  }
 
  getUpdateTaskValue(){
   return this.taskUpdateValue.asObservable()
  }


  setTicketData(ticketData : any){
    this.ticketData.next(ticketData)
  }

  getTicketData(){
   return this.ticketData.asObservable()
  }

  setUserInfoData(data : any){
    this.selectUserInfo.next(data);
  }

  getUserInfoData(){
   return this.selectUserInfo.asObservable();
  }

  setFilterStatusBasedData(value : any){
    this.filterDataBasedOnStatus.next(value)
  }
 
  getFilterStatusBasedData(){
   return this.filterDataBasedOnStatus.asObservable()
  }

  setClientsAndDealersData(value : any){
    this.ClientsAndDealersOnStatus.next(value);
  }

   getClientsAndDealersData(){
   return  this.ClientsAndDealersOnStatus.asObservable();
  }
 
}
