import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmessagesComponent } from './groupmessages.component';

describe('GroupmessagesComponent', () => {
  let component: GroupmessagesComponent;
  let fixture: ComponentFixture<GroupmessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupmessagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupmessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
