import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { LoginFormComponent, OwnerFormComponent } from "../libs/owners/ui/src";

@Component({
  imports: [NxWelcome, RouterModule, OwnerFormComponent,LoginFormComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'pibblest-front-web';

  onTestSubmit(data: any){
    console.log('Datos capturados por el formulario', data);

  }
}
