import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {ConfigurationService} from "./services/configuration/configuration.service";
import {AuthorizeService, provideMmSharedAuth, authorizeInterceptor} from "@meshmakers/shared-auth";
import {defaultAuthorizeOptions} from "./config/defaultAuthorizeOptions";
import {defaultOctoServiceOptions} from "./config/defaultOctoServiceOptions";
import {provideMmSharedServices} from "@meshmakers/shared-services";
import {provideHttpClient, withInterceptors, withInterceptorsFromDi, withJsonpSupport} from "@angular/common/http";
import {CONFIGURATION_SERVICE, OctoErrorLink, provideOctoServices} from "@meshmakers/octo-services";
import {provideMmSharedUi} from "@meshmakers/shared-ui";
import {provideApollo} from "apollo-angular";
import {HttpLink} from "apollo-angular/http";
import {ApolloLink, InMemoryCache} from '@apollo/client/core';
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withJsonpSupport(),
      withInterceptors([authorizeInterceptor]),
      withInterceptorsFromDi()
    ),
    {provide: CONFIGURATION_SERVICE, useClass: ConfigurationService},
    provideRouter(routes),
    provideMmSharedAuth(),
    provideMmSharedServices(),
    provideMmSharedUi(),
    provideOctoServices(defaultOctoServiceOptions),
    provideAnimations(),
    provideAppInitializer(initServices),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const octoErrorLink = inject(OctoErrorLink);
      const configurationService = inject(ConfigurationService);

      const service = configurationService.config.assetServices ?? '';
      const uri = `${service}tenants/${configurationService.config.tenantId}/GraphQL`;

      return {
        link: ApolloLink.from([octoErrorLink, httpLink.create({uri: uri})]),
        cache: new InMemoryCache({
          dataIdFromObject: (o) => <string>o['rtId'],
        }),
      };
    })
  ]
};

export async function initServices(): Promise<void> {
  const configurationService = inject(ConfigurationService);
  const authorizeService = inject(AuthorizeService);

  await configurationService.loadConfigAsync();

  defaultAuthorizeOptions.wellKnownServiceUris = [
    configurationService.config.assetServices,
    configurationService.config.issuer
  ];

  defaultOctoServiceOptions.assetServices = configurationService.config.assetServices;

  defaultAuthorizeOptions.issuer = configurationService.config.issuer;
  defaultAuthorizeOptions.scope = configurationService.config.scope;
  defaultAuthorizeOptions.redirectUri = configurationService.config.redirectUri;
  defaultAuthorizeOptions.postLogoutRedirectUri = configurationService.config.postLogoutRedirectUri;
  defaultAuthorizeOptions.clientId = configurationService.config.clientId;
  defaultAuthorizeOptions.showDebugInformation = true;

  await authorizeService.initialize(defaultAuthorizeOptions);
}
