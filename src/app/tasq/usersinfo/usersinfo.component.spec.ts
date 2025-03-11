import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersinfoComponent } from './usersinfo.component';

describe('UsersinfoComponent', () => {
  let component: UsersinfoComponent;
  let fixture: ComponentFixture<UsersinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersinfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
