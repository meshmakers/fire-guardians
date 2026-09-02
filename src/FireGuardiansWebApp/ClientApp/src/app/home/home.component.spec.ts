import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AuthorizeService } from '@meshmakers/shared-auth';
import { ConfirmationService } from '@meshmakers/shared-ui';

import { HomeComponent } from './home.component';
import { WalletService } from '../services/wallet/wallet.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const authorizeServiceStub = {
    isAuthenticated: signal(false),
    issuer: signal<string | null>(null),
    user: signal<{ name: string } | null>(null),
    login: vi.fn().mockName('login'),
  };

  const confirmationServiceStub = {
    showYesNoConfirmationDialog: vi.fn().mockName('showYesNoConfirmationDialog').mockResolvedValue(false),
    showOkDialog: vi.fn().mockName('showOkDialog').mockResolvedValue(true),
  };

  const walletServiceStub = {
    getWallet: vi.fn().mockName('getWallet').mockResolvedValue(null),
    createUpdateWalletLocation: vi.fn().mockName('createUpdateWalletLocation').mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, ApolloTestingModule],
      providers: [
        // ngOnInit loads the Google Maps API with HttpClient.jsonp; the testing backend
        // keeps that request pending instead of hitting the network.
        provideHttpClient(withJsonpSupport()),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: AuthorizeService, useValue: authorizeServiceStub },
        { provide: ConfirmationService, useValue: confirmationServiceStub },
        { provide: WalletService, useValue: walletServiceStub },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
