import {AddInConfiguration} from "@meshmakers/octo-services";

export interface ConfigurationDto extends AddInConfiguration {
  scope: string;
  tenantId: string;
  vapidPublicKey: string;
}
