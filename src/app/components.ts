import { HomeComponent } from './components/home';
import { LoginComponent } from './components/auth/login';

export {
  HomeComponent,
  LoginComponent,
};

export var AppRoutes = [
  { path: '/home', as: 'Home', component: HomeComponent },
  { path: '/auth/login', as: 'Auth.Login', component: LoginComponent },
];
