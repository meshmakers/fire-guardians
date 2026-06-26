import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDividerModule} from "@angular/material/divider";
import { VERSION } from '../../../environments/currentVersion';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule, MatDividerModule, NgOptimizedImage],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  protected readonly version = VERSION;
}
