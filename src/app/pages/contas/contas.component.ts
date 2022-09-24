import { Component, OnInit } from '@angular/core';
import { ContasService } from 'src/app/services/contas.service';
import { IConta } from '../../interfaces/conta';

@Component({
  selector: 'app-contas',
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.css']
})
export class ContasComponent implements OnInit {

  constructor(private contaService: ContasService) { }

  contas: IConta[] = [];

  ngOnInit(): void {
    this.buscarTodasAsContas();
  }

  buscarTodasAsContas() {
    this.contaService.buscarContas().subscribe((contas: IConta[]) => {
      this.contas = contas;
      this.ordenarContasPorCampo();
    });
  }

  ordenarContasPorCampo(campo: "id" | "agencia" | "numero" | "saldo" = "id") {
    this.contas.sort((a, b) => {
      if (a[campo]! < b[campo]!) {
        return -1;
      }
      if (a[campo]! > b[campo]!) {
        return 1;
      }
      return 0;
    });
  }
}
