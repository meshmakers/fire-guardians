import {Component, computed, EventEmitter, Output, Signal, ChangeDetectionStrategy} from '@angular/core';
import {AuthorizeService} from "@meshmakers/shared-auth";
import {ConfigurationService} from "../../services/configuration/configuration.service";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatListItemIcon, MatNavList} from "@angular/material/list";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-side-nav-list',
  standalone: true,
  imports: [
    MatDivider,
    MatIcon,
    MatNavList,
    MatListItemIcon,
    RouterLink,
    MatListItem
  ],
  templateUrl: './side-nav-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './side-nav-list.component.scss'
})
export class SideNavListComponent {
  public isAuthenticated: Signal<boolean>;
  public userName: Signal<string | null>;
  public authority: Signal<string | null>;

  @Output() sidenavClose = new EventEmitter();

  constructor(
    private readonly authorizeService: AuthorizeService,
    public configurationService: ConfigurationService
  ) {
    this.isAuthenticated = this.authorizeService.isAuthenticated;
    this.userName = computed(() => this.authorizeService.user()?.name ?? null);
    this.authority = this.authorizeService.issuer;
  }

  public login(): void {
    this.authorizeService.login();
  }

  public logout(): void {
    this.authorizeService.logout();
  }

  public onSidenavClose = (): void => {
    this.sidenavClose.emit();
  };

}
