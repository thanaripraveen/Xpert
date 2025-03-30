import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  statuses = [
    "Unassigned", "Open", "In Development", "Resolved", "Closed",
    "Re open", "Need Clarification", "Waiting For Design", "Testing",
    "Ready For Release", "Released", "Longterm Fix"
  ];
  activeStatus = "Need Clarification";
  
  setActiveStatus(status: string) {
    this.activeStatus = status;
  }
  
  getStatusIcon(status: string) {
    switch (status) {
      case "Unassigned": return "fas fa-user-slash";
      case "Open": return "fas fa-folder-open";
      case "In Development": return "fas fa-code";
      case "Resolved": return "fas fa-check-circle";
      case "Closed": return "fas fa-lock";
      case "Re open": return "fas fa-undo-alt";
      case "Need Clarification": return "fas fa-question-circle";
      case "Waiting For Design": return "fas fa-paint-brush";
      case "Testing": return "fas fa-vial";
      case "Ready For Release": return "fas fa-rocket";
      case "Released": return "fas fa-flag-checkered";
      case "Longterm Fix": return "fas fa-wrench";
      default: return "";
    }
  }
  
  
}
