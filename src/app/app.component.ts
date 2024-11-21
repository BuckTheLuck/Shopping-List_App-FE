import { Component } from "@angular/core";
import { environment } from "./environments/enviroment";

@Component({
  selector: "app-root",
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent {
  constructor() {
    console.log(environment.production);
  }
  title = 'frontend-code';
}