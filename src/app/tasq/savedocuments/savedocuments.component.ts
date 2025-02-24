import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-savedocuments',
  templateUrl: './savedocuments.component.html',
  styleUrl: './savedocuments.component.scss'
})
export class SavedocumentsComponent {
  spinner : boolean = false;
  constructor(public activeModal: NgbActiveModal) {
    this.spinner =true
  }

  closeModal() {
    this.activeModal.close();
  }
}
