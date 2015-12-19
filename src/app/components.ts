export * from './components/home';
export * from './components/login';
export * from './components/header';
export * from './components/footer';
export * from './components/navbar';

import { HomeComponent } from './components/home';
import { LoginComponent } from './components/login';

export var AppRoutes = [
  { path: '/home', as: 'Home', component: HomeComponent },
  { path: '/auth/login', as: 'Auth.Login', component: LoginComponent },
];
