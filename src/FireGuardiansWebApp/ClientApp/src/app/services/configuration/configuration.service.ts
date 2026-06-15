import { Injectable } from '@angular/core';
import {ConfigurationDto} from "./configurationDto";
import {IConfigurationService} from "@meshmakers/octo-services";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService implements IConfigurationService {
  private configuration: ConfigurationDto;

  constructor() {
    this.configuration = <ConfigurationDto>{};
  }

  public get config(): ConfigurationDto {
    return this.configuration;
  }

  public async loadConfigAsync(): Promise<void> {
    console.debug('loading config');

    const result = await fetch(`/_configuration`);
    if (!result.ok) {
      throw new Error(`Could not load configuration.'`);
    }

    this.configuration = <ConfigurationDto>await result.json();

    console.debug('end loading config function');
  }
}
