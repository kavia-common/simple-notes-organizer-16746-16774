import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// For SSR, export default must return Promise<ApplicationRef>
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
