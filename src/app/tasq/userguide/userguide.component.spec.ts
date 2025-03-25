import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserguideComponent } from './userguide.component';

describe('UserguideComponent', () => {
  let component: UserguideComponent;
  let fixture: ComponentFixture<UserguideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserguideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
