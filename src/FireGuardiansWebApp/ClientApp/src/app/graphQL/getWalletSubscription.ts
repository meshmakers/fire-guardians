import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type GetWalletSubscriptionQueryVariablesDto = Exact<{
  walletRtId: string;
  endpoint: any;
}>;


export type GetWalletSubscriptionQueryDto = { runtime: { __typename: 'RuntimeModelQuery', fireGuardiansWallet: { __typename: 'FireGuardiansWalletConnection', totalCount: number | null, pageInfo: { __typename: 'PageInfo', endCursor: string | null } | null, items: Array<{ __typename: 'FireGuardiansWallet', rtChangedDateTime: any, name: string, children: { __typename: 'FireGuardiansWallet_ChildrenUnion', fireGuardiansNotificationSubscription: { __typename: 'FireGuardiansNotificationSubscriptionConnection', items: Array<{ __typename: 'FireGuardiansNotificationSubscription', rtId: string } | null> | null } | null } | null } | null> | null } | null } | null };

export const GetWalletSubscriptionDocumentDto = gql`
    query getWalletSubscription($walletRtId: OctoObjectId!, $endpoint: SimpleScalar!) {
  runtime {
    fireGuardiansWallet(rtId: $walletRtId) {
      totalCount
      pageInfo {
        endCursor
      }
      items {
        rtChangedDateTime
        name
        children {
          fireGuardiansNotificationSubscription(
            fieldFilter: [{attributePath: "endpoint", operator: EQUALS, comparisonValue: $endpoint}]
          ) {
            items {
              rtId
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetWalletSubscriptionDtoGQL extends Apollo.Query<GetWalletSubscriptionQueryDto, GetWalletSubscriptionQueryVariablesDto> {
    override document = GetWalletSubscriptionDocumentDto;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }