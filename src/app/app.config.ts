import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,

} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../libs/auth/data-access/auth.interceptor';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimations } from '@angular/platform-browser/animations';



export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), 
    provideRouter(appRoutes), 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix:'/assets/i18n/',
        suffix:'.json'
      }),
    }),

],
};
