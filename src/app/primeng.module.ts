import { NgModule } from "@angular/core";
import { MenubarModule } from "primeng/menubar";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
    declarations: [],
    imports: [
        MenubarModule,
        InputTextModule
    ],
    exports: [
        MenubarModule,
        InputTextModule
    ]
})

export class PrimeNGModule {
    
}