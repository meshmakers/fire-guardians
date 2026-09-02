import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AuthorizeService } from '@meshmakers/shared-auth';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  const authorizeServiceStub = {
    isAuthenticated: signal(false),
    issuer: signal<string | null>(null),
    user: signal<{ name: string } | null>(null),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        // Registers SwPush/SwUpdate without registering a real service worker.
        provideServiceWorker('ngsw-worker.js', { enabled: false }),
        { provide: AuthorizeService, useValue: authorizeServiceStub },
      ],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
