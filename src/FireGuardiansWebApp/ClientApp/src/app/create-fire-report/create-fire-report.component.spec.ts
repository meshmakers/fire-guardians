import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { CreateFireReportComponent } from './create-fire-report.component';

describe('CreateFireReportComponent', () => {
  let component: CreateFireReportComponent;
  let fixture: ComponentFixture<CreateFireReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFireReportComponent],
      providers: [
        // provideRouter also provides the root ActivatedRoute the component injects.
        provideRouter([]),
        provideNoopAnimations(),
        // The component injects the DOM `Location` interface (not @angular/common's),
        // which Angular treats as an ordinary injection token.
        { provide: Location, useValue: window.location },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFireReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
