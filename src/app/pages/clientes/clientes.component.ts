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
  actualClienteIdForEdition: number = 0;

  status: string | number = "";
  errorMessage: string = "";

  clientes: ICliente[] = [];

  constructor(private clienteService: ClientesService, private fb: FormBuilder) { }

  clientForm: any = this.fb.group({
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
    this.buscarTodosOsClientes();
  }

  resetForm() {
    this.isModalForEditing = false;
    this.actualClienteIdForEdition = 0;
    this.clientForm.patchValue({ nome: '', email: '', cpf: '', observacoes: '', ativo: true });
  }

  buscarTodosOsClientes() {
    this.clienteService.listarTodosClientes().subscribe((clientes: ICliente[]) => {
      this.clientes = clientes;
      this.ordenarClientesPorCampo();
    });
  }

  criarCliente() {
    this.clienteService.criarNovoCliente({
      ...this.clientForm.value
    } as ICliente)
      .subscribe({
        next: data => {
          this.status = 'Creation successful';

          this.buscarTodosOsClientes();

          alert(this.status)

          const close_button: any = document.querySelector('#btn-close');
          close_button!.click();

          this.clientForm.patchValue({ nome: '', email: '', cpf: '', observacoes: '', ativo: true });
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      });
  }

  deletarCliente(id: number) {
    this.clienteService.deletarCliente(id)
      .subscribe({
        next: data => {
          this.status = 'Delete successful';
          alert(this.status)
          this.buscarTodosOsClientes();
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      });
  }

  ordenarClientesPorCampo(campo: any = { value: "id" }) {
    const filtered_field: "id" | "nome" | "email" = campo.value
    this.clientes.sort((a, b) => {
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
      this.editarCliente();
      return;
    }

    this.criarCliente();
  }

  buscarCliente(cpf: string, id: number) {
    this.isModalForEditing = true;
    this.actualClienteIdForEdition = id;

    this.clienteService.buscarClientePorCpf(cpf)
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
          this.clientForm.patchValue({ nome: '', email: '', cpf: '', observacoes: '', ativo: true });
          this.errorMessage = error.message;
          console.error('There was an error!', error);
          alert("Erro ao pegar informacoes do cliente");
        }
      })
  }

  editarCliente() {
    this.clienteService.editarClientePorId(this.actualClienteIdForEdition, {
      ...this.clientForm.value
    } as ICliente)
      .subscribe({
        next: data => {
          this.status = 'Edition successful';

          this.buscarTodosOsClientes();

          alert(this.status);

          const close_button: any = document.querySelector('#btn-close');
          close_button!.click();

          this.clientForm.patchValue({ nome: '', email: '', cpf: '', observacoes: '', ativo: true });
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      });

    this.actualClienteIdForEdition = 0;
    this.isModalForEditing = false;
  }
}
