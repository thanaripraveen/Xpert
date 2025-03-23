import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsmodulesComponent } from './cmsmodules.component';

describe('CmsmodulesComponent', () => {
  let component: CmsmodulesComponent;
  let fixture: ComponentFixture<CmsmodulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmsmodulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CmsmodulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
