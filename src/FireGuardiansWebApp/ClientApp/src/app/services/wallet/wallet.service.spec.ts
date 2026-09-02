import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AuthorizeService } from '@meshmakers/shared-auth';

import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;

  const authorizeServiceStub = {
    isAuthenticated: signal(false),
    issuer: signal<string | null>(null),
    user: signal<{ name: string } | null>(null),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [
        { provide: AuthorizeService, useValue: authorizeServiceStub },
      ],
    });
    service = TestBed.inject(WalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
