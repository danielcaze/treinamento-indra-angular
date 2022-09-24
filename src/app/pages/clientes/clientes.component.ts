import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ICliente } from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  isModalForEditing: boolean = false;
  actualClientIdForEdition: number = 0;

  formInitialValue = { nome: '', email: '', cpf: '', observacoes: '', ativo: true }

  status: string | number = "";
  errorMessage: string = "";

  clients: ICliente[] = [];

  constructor(private clienteService: ClientesService, private fb: FormBuilder) { }

  clientForm = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    cpf: ['', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]],
    observacoes: [''],
    ativo: [true, this.isModalForEditing && Validators.required]
  });

  ngOnInit(): void {
    this.getAllClients();
  }

  resetForm() {
    this.isModalForEditing = false;
    this.actualClientIdForEdition = 0;
    this.clientForm.patchValue(this.formInitialValue);
  }

  getAllClients() {
    this.clienteService.getAllClients().subscribe((clientes: ICliente[]) => {
      this.clients = clientes;
      this.orderClientsByField();
    });
  }

  handleClientCreation() {
    this.clienteService.createClient({
      ...this.clientForm.value,
    } as ICliente)
      .subscribe({
        next: data => {
          this.status = 'Creation successful';

          this.getAllClients();

          alert(this.status);

          const close_button: any = document.querySelector('#btn-close');
          close_button!.click();

          this.clientForm.patchValue(this.formInitialValue);
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      });
  }

  handleClientDeletion(id: number) {
    this.clienteService.deleteClientById(id)
      .subscribe({
        next: data => {
          this.status = 'Delete successful';
          alert(this.status)
          this.getAllClients();
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      });
  }

  orderClientsByField(campo: any = { value: "id" }) {
    const filtered_field: "id" | "nome" | "email" = campo.value
    this.clients.sort((a, b) => {
      if (a[filtered_field]! < b[filtered_field]!) {
        return -1;
      }
      if (a[filtered_field]! > b[filtered_field]!) {
        return 1;
      }
      return 0;
    });
  }

  onSubmit() {
    if (!this.clientForm.valid) {
      alert("Formulario Invalido");
      return;
    }

    if (this.isModalForEditing) {
      this.handleClientEdition();
      return;
    }

    this.handleClientCreation();
  }

  getClientById(id: number) {
    this.isModalForEditing = true;
    this.actualClientIdForEdition = id;
    this.clientForm.patchValue(this.formInitialValue);

    this.clienteService.getClientById(id)
      .subscribe({
        next: (cliente: ICliente) => {
          const { nome, observacoes, email, cpf, ativo } = cliente;

          this.clientForm.patchValue({
            nome,
            observacoes,
            email,
            cpf,
            ativo
          });
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
          alert("Erro ao pegar informacoes do cliente");
        }
      })
  }

  handleClientEdition() {
    this.clienteService.editClientById(this.actualClientIdForEdition, {
      ...this.clientForm.value,
      id: this.actualClientIdForEdition
    } as ICliente)
      .subscribe({
        next: data => {
          this.status = 'Edition successful';

          this.getAllClients();

          alert(this.status);

          const close_button: any = document.querySelector('#btn-close');
          close_button!.click();

          this.clientForm.patchValue(this.formInitialValue);
          this.actualClientIdForEdition = 0;
          this.isModalForEditing = false;
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      });
  }
}
