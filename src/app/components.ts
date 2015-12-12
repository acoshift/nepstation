export * from './components/home';
export * from './components/auth/login';
export * from './components/header';
export * from './components/footer';

import { HomeComponent } from './components/home';
import { LoginComponent } from './components/auth/login';

export var AppRoutes = [
  { path: '/home', as: 'Home', component: HomeComponent },
  { path: '/auth/login', as: 'Auth.Login', component: LoginComponent },
];
