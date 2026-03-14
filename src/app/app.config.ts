import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyAzGDljlRNAv6cmzrDMvTFKQ91Zg93FvIk",
  authDomain: "logins-61353.firebaseapp.com",
  databaseURL: "ttps://logins-61353-default-rtdb.firebaseio.com",
  projectId: "logins-61353",
  storageBucket: "logins-61353.appspot.com",
  messagingSenderId: "970496602059",
  appId: "1:970496602059:web:dfddf785b06ac0c9dc104e",
  measurementId: "G-2Y7MZB7L3L"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth())
  ]
};
