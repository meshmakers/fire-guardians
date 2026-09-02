import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthorizeService } from '@meshmakers/shared-auth';

import { SideNavListComponent } from './side-nav-list.component';

describe('SideNavListComponent', () => {
  let component: SideNavListComponent;
  let fixture: ComponentFixture<SideNavListComponent>;

  const authorizeServiceStub = {
    isAuthenticated: signal(false),
    issuer: signal<string | null>(null),
    user: signal<{ name: string } | null>(null),
    login: vi.fn().mockName('login'),
    logout: vi.fn().mockName('logout'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavListComponent],
      providers: [
        provideRouter([]),
        { provide: AuthorizeService, useValue: authorizeServiceStub },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
