import type * as Types from './globalTypes';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type CreateFireReportMutationVariablesDto = Exact<{
  position: Types.PositionInputDto;
  name: string;
  description?: string | null | undefined;
}>;


export type CreateFireReportMutationDto = { runtime: { __typename: 'Runtime', fireGuardiansFireReports: { __typename: 'FireGuardiansFireReportMutations', create: Array<{ __typename: 'FireGuardiansFireReport', rtId: string, name: string, description: string | null, location: { __typename: 'RtGeospatialValueDto', point: { __typename: 'Point', coordinates: { __typename: 'Position', latitude: number, longitude: number, altitude: number | null } | null } | null } } | null> | null } | null } | null };

export const CreateFireReportDocumentDto = gql`
    mutation createFireReport($position: PositionInput!, $name: String!, $description: String) {
  runtime {
    fireGuardiansFireReports {
      create(
        entities: [{name: $name, description: $description, location: {coordinates: $position}}]
      ) {
        rtId
        name
        description
        location {
          point {
            coordinates {
              latitude
              longitude
              altitude
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
  export class CreateFireReportDtoGQL extends Apollo.Mutation<CreateFireReportMutationDto, CreateFireReportMutationVariablesDto> {
    override document = CreateFireReportDocumentDto;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }