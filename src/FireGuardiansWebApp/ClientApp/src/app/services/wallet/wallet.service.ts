import {Injectable} from '@angular/core';
import {AuthorizeService} from "@meshmakers/shared-auth";
import {firstValueFrom} from "rxjs";
import {GetWalletDtoGQL, GetWalletQueryDto} from "../../graphQL/getWallet";
import {CreateWalletDtoGQL} from "../../graphQL/createWallet";
import {UpdateWalletLocationDtoGQL} from "../../graphQL/updateWalletLocation";

type WalletQueryRuntime = NonNullable<GetWalletQueryDto['runtime']>;
type WalletConnection = NonNullable<WalletQueryRuntime['fireGuardiansWallet']>;
type WalletItems = NonNullable<WalletConnection['items']>;
export type Wallet = NonNullable<WalletItems[number]>;

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private readonly getWalletDtoGQL: GetWalletDtoGQL,
    private readonly createWallet: CreateWalletDtoGQL,
    private readonly updateWalletLocation: UpdateWalletLocationDtoGQL,
    private readonly authorizeService: AuthorizeService) {

  }

  async createUpdateWalletLocation(homeCenter: google.maps.LatLngLiteral): Promise<void> {
    // This code create a wallet for the user with the current location
    const wallet = await this.getWallet();
    if (wallet) {
      await firstValueFrom(this.updateWalletLocation.mutate({
        variables: {rtId: wallet.rtId, position: {latitude: homeCenter.lat, longitude: homeCenter.lng}}
      }));
    } else {
      const u = this.authorizeService.user();
      if (u) {
        const id = u.sub;

        await firstValueFrom(this.createWallet.mutate({
          variables: {
            walletInput:
              {
                identityId: id,
                name: u.name,
                location:
                  {
                    coordinates: {latitude: homeCenter.lat, longitude: homeCenter.lng}
                  }
              }
          }
        }));
      }
    }
  }

  async getWallet(): Promise<Wallet | null> {
    const u = this.authorizeService.user();
    if (u) {
      const id = u.sub;

      const apolloQueryResult = await firstValueFrom(this.getWalletDtoGQL.fetch({variables: {identityId: id}}));
      if (apolloQueryResult.data?.runtime?.fireGuardiansWallet?.items?.length) {
        return apolloQueryResult.data.runtime?.fireGuardiansWallet.items[0];
      }
    }
    return null;
  }
}
