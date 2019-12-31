import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { SalesLogComponent } from './desktop/components/sales-log/sales-log.component';
import { MobileSalesLogComponent } from './mobile/components/mobile-sales-log/mobile-sales-log.component';
import { ApplicationStateService } from './services/application-state.service';

const desktopRoutes: Routes = [
  { path: 'sales-log', component: SalesLogComponent },
  { path: '', redirectTo: '/sales-log', pathMatch: 'full' },
];

const mobileRoutes: Routes = [
  { path: 'sales-log', component: MobileSalesLogComponent },
  { path: '', redirectTo: '/sales-log', pathMatch: 'full' },
]

@NgModule({
  imports: [RouterModule.forRoot(desktopRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  public constructor(
    private router: Router,
    private applicationStateService: ApplicationStateService,
  ) {

    if (applicationStateService.getIsMobileResolution()) {
      console.log('resetRoute');
      router.resetConfig(mobileRoutes);
    }
  }
}
