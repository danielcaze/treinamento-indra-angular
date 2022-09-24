import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IConta } from '../interfaces/conta';

@Injectable({
  providedIn: 'root'
})
export class ContasService {

  constructor(private httpService: HttpClient) { }

  endpoint = 'contas/';
  api = environment.api;

  buscarContas() {
    return this.httpService.get<IConta[]>(`${this.api}/${this.endpoint}`);
  }

  deletarConta(id: number) {
    this.httpService.delete(`${this.api}/${this.endpoint}${id}`);
  }
}