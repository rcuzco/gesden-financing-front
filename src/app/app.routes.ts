import { Routes } from '@angular/router';
import { ROUTES_CONSTANTS } from '../app/shared/constants/routes/routes.constants';
import { NoContentComponent } from './shared/components/no-content';
import { AuthGuard } from './shared/guards';


export const ROUTES: Routes = [
  {
    path: ROUTES_CONSTANTS.LOGIN.path,
    loadChildren: () => import('./modules/+login/login.module').then(m => m.LoginModule)
  },
  {
    path: ROUTES_CONSTANTS.HOME.path,
    loadChildren: () => import('./modules/+home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: ROUTES_CONSTANTS.LOGIN.path,
    pathMatch: 'full'
  },
  { path: '**', component: NoContentComponent }
];
