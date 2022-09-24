import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { HomeComponent } from './pages/home/home.component';
import { ContasComponent } from './pages/contas/contas.component';
import { PaginaComponent } from './pages/clientes/pagina/pagina.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'clientes', component: ClientesComponent
  },
  {
    path: 'contas', component: ContasComponent
  },
  {
    path: 'cliente/:id', component: PaginaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
