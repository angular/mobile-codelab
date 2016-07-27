import {browserPlatform} from '@angular/platform-browser';

import {NgWeatherAppModuleNgFactory} from './module.ngfactory';

browserPlatform().bootstrapModuleFactory(NgWeatherAppModuleNgFactory);