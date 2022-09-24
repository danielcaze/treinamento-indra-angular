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

  getAllClients() {
    return this.http.get<ICliente[]>(`${this.api}/${this.endpoint}`);
  }

  getClientByCpf(cpf: string) {
    return this.http.get<ICliente>(`${this.api}/${this.endpoint}buscarPorCpf/${cpf}`);
  }

  getClientById(id: number) {
    return this.http.get<ICliente>(`${this.api}/${this.endpoint}${id}`);
  }

  createClient(client: ICliente) {
    return this.http.post<ICliente>(`${this.api}/${this.endpoint}`, client);
  }


  deleteClientById(id: number) {
    return this.http.delete<ICliente>(`${this.api}/${this.endpoint}${id}`);
  }


  editClientById(id: number, client: ICliente) {
    return this.http.put<ICliente>(`${this.api}/${this.endpoint}${id}`, client);
  }
}
