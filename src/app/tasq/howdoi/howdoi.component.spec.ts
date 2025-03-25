import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowdoiComponent } from './howdoi.component';

describe('HowdoiComponent', () => {
  let component: HowdoiComponent;
  let fixture: ComponentFixture<HowdoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HowdoiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HowdoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
