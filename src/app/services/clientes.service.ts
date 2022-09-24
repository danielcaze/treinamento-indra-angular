import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  endpoint = 'clientes/';
  api = environment.api;

  constructor(private http: HttpClient) { }

  listarTodosClientes() {
    return this.http.get<ICliente[]>(`${this.api}/${this.endpoint}`);
  }

  criarNovoCliente(client: ICliente) {
    return this.http.post<ICliente>(`${this.api}/${this.endpoint}`, client);
  }

  deletarCliente(id: number) {
    return this.http.delete<ICliente>(`${this.api}/${this.endpoint}${id}`);
  }

  buscarClientePorCpf(cpf: string) {
    return this.http.get<ICliente>(`${this.api}/${this.endpoint}buscarPorCpf/${cpf}`);
  }

  editarClientePorId(id: number, client: ICliente) {
    return this.http.put<ICliente>(`${this.api}/${this.endpoint}${id}`, client);
  }
}
