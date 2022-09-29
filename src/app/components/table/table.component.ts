import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICliente } from 'src/app/interfaces/cliente';
import { IConta } from 'src/app/interfaces/conta';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() clients: ICliente[] = [];
  @Input() accounts: IConta[] = [];

  @Output() client_deletion: EventEmitter<any> = new EventEmitter();
  @Output() get_client_by_id: EventEmitter<any> = new EventEmitter();

  trashIcon = faTrash;
  pencilIcon = faPencil;

  page: string;

  constructor(private route: Router) {
    this.page = String(this.route.url)
  }

  ngOnInit(): void {
  }

  handleDeleteClient(id: number) {
    this.client_deletion.emit(id)
  }

  handleGetClientById(id: number) {
    this.get_client_by_id.emit(id)
  }

}
