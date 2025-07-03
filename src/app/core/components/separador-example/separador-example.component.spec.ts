import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeparadorExampleComponent } from './separador-example.component';

describe('SeparadorExampleComponent', () => {
  let component: SeparadorExampleComponent;
  let fixture: ComponentFixture<SeparadorExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeparadorExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeparadorExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
