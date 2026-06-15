import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {CreateFireReportComponent} from "./create-fire-report/create-fire-report.component";
import {authorizeGuard} from "@meshmakers/shared-auth";

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [authorizeGuard] },
  { path: 'report', component: CreateFireReportComponent, canActivate: [authorizeGuard] },
];
