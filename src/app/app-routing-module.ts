import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegisterPageComponent } from "./components/register-page/register-page.component";
import { LoginPageComponent } from "./components/login-page/login-page.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { ListPageComponent } from "./components/list-page/list-page.component";
import { TrashPageComponent } from "./components/trash-page/trash-page.component";
import { AdminLoginPageComponent } from "./components/admin-login-page/admin-login-page.component";
import { AdminPanelMainComponent } from "./components/admin-panel-main/admin-panel-main.component";

const routes: Routes = [
    { 
        path: 'register', 
        component: RegisterPageComponent
    },
    {
        path: 'login',
        component: LoginPageComponent
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path:'main',
        component: MainPageComponent
    },
    {
        path:'list/:id',
        component: ListPageComponent
    },
    {
        path:'trash',
        component: TrashPageComponent
    },
    {
        path:'login-admin',
        component: AdminLoginPageComponent
    },
    {
        path:'panel',
        component: AdminPanelMainComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }