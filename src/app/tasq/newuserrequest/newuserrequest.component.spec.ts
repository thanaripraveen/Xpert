import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewuserrequestComponent } from './newuserrequest.component';

describe('NewuserrequestComponent', () => {
  let component: NewuserrequestComponent;
  let fixture: ComponentFixture<NewuserrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewuserrequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewuserrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
