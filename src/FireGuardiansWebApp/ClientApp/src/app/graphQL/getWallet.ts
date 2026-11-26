import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type GetWalletQueryVariablesDto = Exact<{
  identityId: any;
}>;


export type GetWalletQueryDto = { runtime: { __typename: 'RuntimeModelQuery', fireGuardiansWallet: { __typename: 'FireGuardiansWalletConnection', items: Array<{ __typename: 'FireGuardiansWallet', rtId: string, identityId: string, name: string, location: { __typename: 'RtGeospatialValueDto', point: { __typename: 'Point', coordinates: { __typename: 'Position', latitude: number, longitude: number } | null } | null } | null } | null> | null } | null } | null };

export const GetWalletDocumentDto = gql`
    query getWallet($identityId: SimpleScalar!) {
  runtime {
    fireGuardiansWallet(
      fieldFilter: [{attributePath: "identityId", operator: EQUALS, comparisonValue: $identityId}]
    ) {
      items {
        rtId
        identityId
        name
        location {
          point {
            coordinates {
              latitude
              longitude
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
  export class GetWalletDtoGQL extends Apollo.Query<GetWalletQueryDto, GetWalletQueryVariablesDto> {
    override document = GetWalletDocumentDto;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }