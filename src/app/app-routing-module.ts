import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RegisterPageComponent } from "./components/register-page/register-page.component";
import { LoginPageComponent } from "./components/login-page/login-page.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { ListPageComponent } from "./components/list-page/list-page.component";
import { TrashPageComponent } from "./components/trash-page/trash-page.component";

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
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }