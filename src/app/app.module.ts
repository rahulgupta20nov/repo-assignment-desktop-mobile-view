import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SalesLogComponent } from './desktop/components/sales-log/sales-log.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AddNewTaskComponent } from './desktop/components/sales-log/add-new-task/add-new-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { SalesTableComponent } from './desktop/components/sales-log/sales-table/sales-table.component';
import { MatTableModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { DistanceDatePipe } from './pipe/distance-date.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmDialogComponent } from './desktop/components/confirm-dialog/confirm-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MobileSalesLogComponent } from './mobile/components/mobile-sales-log/mobile-sales-log.component';
import { ApplicationStateService } from './services/application-state.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
  declarations: [
    AppComponent,
    SalesLogComponent,
    AddNewTaskComponent,
    SalesTableComponent,
    DistanceDatePipe,
    ConfirmDialogComponent,
    MobileSalesLogComponent,
  ],
  entryComponents: [AddNewTaskComponent, ConfirmDialogComponent, MobileSalesLogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatMenuModule,
    MatCheckboxModule,
    MatChipsModule,
    MatToolbarModule,
    MatBadgeModule,
    MatSidenavModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, ApplicationStateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
