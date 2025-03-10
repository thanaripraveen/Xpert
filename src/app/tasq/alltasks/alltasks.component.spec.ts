import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlltasksComponent } from './alltasks.component';

describe('AlltasksComponent', () => {
  let component: AlltasksComponent;
  let fixture: ComponentFixture<AlltasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlltasksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlltasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
