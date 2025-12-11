import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { AppComponent } from './app/app.component';
import { createApollo } from './app/graphql.config';

const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideApollo(createApollo)
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
