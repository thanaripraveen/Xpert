import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alltasks',
  templateUrl: './alltasks.component.html',
  styleUrl: './alltasks.component.scss'
})
export class AlltasksComponent implements OnInit{
spinner : boolean = false;
statusData : any =[
  {'name' : 'Open' , count : 179},
  {'name' : 'Closed' , count : 179},
  {'name' : 'Resolved' , count : 179},
  {'name' : 'Un Assigned' , count : 179},
  {'name' : 'In Development' , count : 179},
  {'name' : 'Testing' , count : 179},
  {'name' : 'Ready For Release' , count : 179},
  {'name' : 'Un Resolved' , count : 179},
]
  constructor(){

  }

  ngOnInit(): void {
    
  }
}
