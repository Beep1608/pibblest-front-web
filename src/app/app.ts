import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { LoginFormComponent, OwnerFormComponent } from "../libs/owners/ui/src";
import { TranslateService } from '@ngx-translate/core';

@Component({
  imports: [NxWelcome, RouterModule, OwnerFormComponent,LoginFormComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'pibblest-front-web';

  private translate = inject(TranslateService);

  constructor(){
    this.translate.setFallbackLang('en');

    const browserLang = this.translate.getBrowserLang();

    const lang = browserLang?.match(/en|es/) ? browserLang: 'en';

    this.translate.use(lang);
  }
  onTestSubmit(data: any){
    console.log('Datos capturados por el formulario', data);

  }
}
