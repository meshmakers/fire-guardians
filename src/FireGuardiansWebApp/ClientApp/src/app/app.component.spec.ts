import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AuthorizeService } from '@meshmakers/shared-auth';
import { AppComponent } from './app.component';
import { NotificationService } from './services/notification/notification.service';

describe('AppComponent', () => {
  // AppComponent renders HeaderComponent and SideNavListComponent, which both read
  // AuthorizeService signals in their constructor; the header additionally injects
  // NotificationService (Apollo + SwPush behind it).
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
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: AuthorizeService, useValue: authorizeServiceStub },
        { provide: NotificationService, useValue: notificationServiceStub },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'my-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('my-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, my-app');
  });
});
