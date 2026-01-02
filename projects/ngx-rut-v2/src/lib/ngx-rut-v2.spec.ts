import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRutV2 } from './ngx-rut-v2';

describe('NgxRutV2', () => {
  let component: NgxRutV2;
  let fixture: ComponentFixture<NgxRutV2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxRutV2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxRutV2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
