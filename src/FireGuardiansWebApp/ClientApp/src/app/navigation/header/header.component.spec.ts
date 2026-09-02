import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AuthorizeService } from '@meshmakers/shared-auth';

import { HeaderComponent } from './header.component';
import { NotificationService } from '../../services/notification/notification.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const authorizeServiceStub = {
    isAuthenticated: signal(false),
    issuer: signal<string | null>(null),
    user: signal<{ name: string } | null>(null),
    login: vi.fn().mockName('login'),
    logout: vi.fn().mockName('logout'),
  };

  const notificationServiceStub = {
    subscribeToNotifications: vi.fn().mockName('subscribeToNotifications').mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideNoopAnimations(),
        { provide: AuthorizeService, useValue: authorizeServiceStub },
        { provide: NotificationService, useValue: notificationServiceStub },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
