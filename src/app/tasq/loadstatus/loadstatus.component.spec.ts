import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadstatusComponent } from './loadstatus.component';

describe('LoadstatusComponent', () => {
  let component: LoadstatusComponent;
  let fixture: ComponentFixture<LoadstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadstatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
