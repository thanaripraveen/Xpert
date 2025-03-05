import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../providers/api.service';
import moment from 'moment';
import { environment } from '../../../environments/environment';
import { SavedocumentsComponent } from '../savedocuments/savedocuments.component';
import { CommentsComponent } from '../comments/comments.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  spinner: boolean = false;
  viewTicketInfo: any;
  xpertProfileImg = environment.xpertProfileImg;
  private subscription!: Subscription;
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private api: ApiService) { }

  ngOnInit(): void {
    this.spinner = true;
   this.subscription =  this.api.getTicketData().subscribe((res: any) => {
      if (res) {
        this.viewTicketInfo = res;
        this.spinner = false;
      }
      else {
        this.spinner = false;
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  LocalTimeConvertioninHours(DateTime: any) {
    var utcDate = moment.utc(DateTime);
    var dateWithTimezone = utcDate.local().format('MM.DD.YY hh:mm A');
    return dateWithTimezone;

  }

  openDocumentsOrCommentsComponent(data: any,module : any) {
    this.api.setTicketData(data)
    if(module == 'documents'){
       this.modalService.open(SavedocumentsComponent, {
      windowClass: 'documentModal',
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    }
    else if(module == 'comments'){
       this.modalService.open(CommentsComponent, {
              windowClass: 'commentsModal',
              size: 'lg', 
              backdrop: 'static',
              centered : true, 
            });
    }
  }


  closeModal() {
    this.activeModal.close();
  }
}
