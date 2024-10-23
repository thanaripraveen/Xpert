import { Injectable } from '@angular/core';
import * as bootstrap from 'bootstrap'
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalData: any;

  constructor() {}

  open(modalId: string, data?: any): void {
    this.modalData = data;
    const modalElement : any = document.getElementById(modalId);
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.show();
  }

  close(modalId: string): void {
    const modalElement : any= document.getElementById(modalId);
    const bootstrapModal = new bootstrap.Modal(modalElement);
    bootstrapModal.hide();
  }

  getData(): any {
    return this.modalData;
  }
}
