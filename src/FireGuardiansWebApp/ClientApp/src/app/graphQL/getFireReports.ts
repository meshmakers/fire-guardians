import type * as Types from './globalTypes';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type GetFireReportsQueryVariablesDto = Exact<{
  position: Types.PositionInputDto;
  minDistance?: number | null | undefined;
  maxDistance?: number | null | undefined;
}>;


export type GetFireReportsQueryDto = { runtime: { __typename: 'RuntimeModelQuery', fireGuardiansFireReport: { __typename: 'FireGuardiansFireReportConnection', items: Array<{ __typename: 'FireGuardiansFireReport', rtId: string, rtCreationDateTime: any, name: string, description: string | null, location: { __typename: 'RtGeospatialValueDto', distance: number | null, point: { __typename: 'Point', coordinates: { __typename: 'Position', latitude: number, longitude: number, altitude: number | null } | null } | null } } | null> | null } | null } | null };

export const GetFireReportsDocumentDto = gql`
    query getFireReports($position: PositionInput!, $minDistance: Float, $maxDistance: Float) {
  runtime {
    fireGuardiansFireReport(
      first: 200
      geoNearFilter: {attributeName: "location", minDistance: $minDistance, maxDistance: $maxDistance, point: {coordinates: $position}}
    ) {
      items {
        rtId
        rtCreationDateTime
        name
        description
        location {
          distance
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
  export class GetFireReportsDtoGQL extends Apollo.Query<GetFireReportsQueryDto, GetFireReportsQueryVariablesDto> {
    override document = GetFireReportsDocumentDto;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }