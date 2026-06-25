import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AbstractDetailsComponent} from "@meshmakers/shared-ui-legacy";
import {FireGuardiansFireReportDto} from "../graphQL/globalTypes";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "@meshmakers/shared-services";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-create-fire-report',
  standalone: true,
  imports: [
    MatProgressBar,
    MatToolbar,
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon
  ],
  templateUrl: './create-fire-report.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './create-fire-report.component.scss'
})
export class CreateFireReportComponent extends AbstractDetailsComponent<FireGuardiansFireReportDto> implements OnInit {
  private readonly id: string | null;

  constructor(
    activatedRoute: ActivatedRoute,
    private readonly location: Location,
    fb: FormBuilder,
    private readonly messageService: MessageService
  ) {
    super(
      fb.group({
        name: ['', Validators.required],
        description: [],
      })
    );

    this.id = null;
  }

  ngOnInit(): void {
  }

  async save(): Promise<void> {
  }
}
