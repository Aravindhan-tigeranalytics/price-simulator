import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component"
import {AuthComponent} from "./auth/auth.component"
const routes: Routes = [

  {
    path: '',
    component: AppComponent

  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
