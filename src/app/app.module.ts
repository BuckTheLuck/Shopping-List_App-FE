import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing-module";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { PrimeNGModule } from "./primeng.module";
import { HttpClientModule, provideHttpClient } from "@angular/common/http";
import { RegisterPageComponent } from "./components/register-page/register-page.component";

import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { FieldsetModule } from "primeng/fieldset";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { MatDialogModule } from '@angular/material/dialog';

import { LoginPageComponent } from "./components/login-page/login-page.component";
import { PasswordModule } from "primeng/password";
import { PanelModule } from "primeng/panel";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DividerModule } from "primeng/divider";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListPageComponent } from "./components/list-page/list-page.component";
import { TrashPageComponent } from "./components/trash-page/trash-page.component";

@NgModule({
    declarations: [
        AppComponent,
        RegisterPageComponent,
        LoginPageComponent,
        MainPageComponent,
        ListPageComponent,
        TrashPageComponent
    ],
    imports : [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        RouterModule,
        PrimeNGModule,
        CalendarModule,
        CardModule,
        FieldsetModule,
        InputTextModule,
        ReactiveFormsModule,
        ButtonModule,
        PasswordModule,
        PanelModule,
        BrowserAnimationsModule,
        FormsModule,
        DividerModule,
        MatDialogModule,
        DialogModule,
        OverlayPanelModule
    ],
    providers: [provideHttpClient()],
    bootstrap: [AppComponent]
})
export class AppModule {  }