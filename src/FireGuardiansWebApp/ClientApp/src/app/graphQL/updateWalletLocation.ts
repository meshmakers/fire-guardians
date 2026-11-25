import type * as Types from './globalTypes';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type UpdateWalletLocationMutationVariablesDto = Exact<{
  rtId: string;
  position: Types.PositionInputDto;
}>;


export type UpdateWalletLocationMutationDto = { runtime: { __typename: 'Runtime', fireGuardiansWallets: { __typename: 'FireGuardiansWalletMutations', update: Array<{ __typename: 'FireGuardiansWallet', rtId: string, identityId: string, name: string, location: { __typename: 'RtGeospatialValueDto', point: { __typename: 'Point', coordinates: { __typename: 'Position', latitude: number, longitude: number } | null } | null } | null } | null> | null } | null } | null };

export const UpdateWalletLocationDocumentDto = gql`
    mutation updateWalletLocation($rtId: OctoObjectId!, $position: PositionInput!) {
  runtime {
    fireGuardiansWallets {
      update(entities: [{rtId: $rtId, item: {location: {coordinates: $position}}}]) {
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
  export class UpdateWalletLocationDtoGQL extends Apollo.Mutation<UpdateWalletLocationMutationDto, UpdateWalletLocationMutationVariablesDto> {
    override document = UpdateWalletLocationDocumentDto;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }