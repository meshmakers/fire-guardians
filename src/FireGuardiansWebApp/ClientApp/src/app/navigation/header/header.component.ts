import {Component, computed, EventEmitter, Output, Signal, ChangeDetectionStrategy} from '@angular/core';
import {AuthorizeService} from "@meshmakers/shared-auth";
import {ConfigurationService} from "../../services/configuration/configuration.service";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {NotificationService} from "../../services/notification/notification.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatIconButton,
    MatMenuItem,
    MatTooltip
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public isAuthenticated: Signal<boolean>;
  public userName: Signal<string | null>;
  public authority: Signal<string | null>;

  @Output() public sidenavToggle = new EventEmitter();

  constructor(
    protected readonly authorizeService: AuthorizeService,
    private readonly notificationService: NotificationService,
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

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  public async addNotification() :Promise<void> {
    await this.notificationService.subscribeToNotifications();
  }
}
