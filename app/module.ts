import {NgModule, ApplicationRef} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {NgWeatherApp} from './components/app';

@NgModule({
  declarations: [NgWeatherApp],
  entryComponents: [NgWeatherApp],
  imports: [BrowserModule]
})
export class NgWeatherAppModule {

  constructor(appRef: ApplicationRef) {
    appRef.bootstrap(NgWeatherApp);
  }
}
