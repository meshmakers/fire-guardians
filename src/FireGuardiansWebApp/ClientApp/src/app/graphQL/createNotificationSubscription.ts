import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type CreateNotificationSubscriptionMutationVariablesDto = Exact<{
  endpoint: string;
  config?: string | null | undefined;
  parentWalletRtId: string;
}>;


export type CreateNotificationSubscriptionMutationDto = { runtime: { __typename: 'Runtime', fireGuardiansNotificationSubscriptions: { __typename: 'FireGuardiansNotificationSubscriptionMutations', create: Array<{ __typename: 'FireGuardiansNotificationSubscription', rtId: string, endpoint: string, subscriptionConfiguration: string | null } | null> | null } | null } | null };

export const CreateNotificationSubscriptionDocumentDto = gql`
    mutation createNotificationSubscription($endpoint: String!, $config: String, $parentWalletRtId: OctoObjectId!) {
  runtime {
    fireGuardiansNotificationSubscriptions {
      create(
        entities: [{endpoint: $endpoint, subscriptionConfiguration: $config, parent: {target: {rtId: $parentWalletRtId, ckTypeId: "FireGuardians/Wallet"}, modOption: CREATE}}]
      ) {
        rtId
        endpoint
        subscriptionConfiguration
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateNotificationSubscriptionDtoGQL extends Apollo.Mutation<CreateNotificationSubscriptionMutationDto, CreateNotificationSubscriptionMutationVariablesDto> {
    override document = CreateNotificationSubscriptionDocumentDto;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }