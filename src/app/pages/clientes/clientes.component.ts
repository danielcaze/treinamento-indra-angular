import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICliente } from 'src/app/interfaces/cliente';
import { AlertaService } from 'src/app/services/alerta.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DataService } from 'src/app/services/data.service';

let clients: ICliente[] = [];
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  @ViewChild('submit_button') submit_button: ElementRef;

  is_modal_open: boolean = false;
  modal_type: "create" | "update" | "delete" | "" = ""
  actual_client_id: number = 0;

  clientForm: FormGroup;
  form_initial_value = { nome: '', email: '', cpf: '', observacoes: '', ativo: true }

  status: string | number = "";
  error_message: string = "";

  clients: ICliente[] = clients;

  constructor(
    private clientsService: ClientesService,
    private alertsService: AlertaService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private dataeService: DataService
  ) {
    this.dataeService.clickCreate().subscribe(() => { this.handleCreateModalOpen() });

    this.getAllClients();

    this.clientForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      cpf: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ]],
      observacoes: [''],
      ativo: [true, this.modal_type === "update" && Validators.required]
    });
  }

  ngOnInit(): void {
  }

  handleCloseModal() {
    this.is_modal_open = false;
    this.modal_type = "";
  }

  handleCreateModalOpen() {
    this.modal_type = "create";
    this.is_modal_open = true;
  }

  handleUpdateModalOpen(id: number) {
    this.resetForm();
    this.actual_client_id = id;
    this.modal_type = "update"
    this.is_modal_open = true;

    this.clientsService.getClientById(id)
      .subscribe({
        next: (cliente: ICliente) => {
          const { id, ...rest } = cliente;
          this.clientForm.patchValue({
            ...rest
          });
        },
        error: error => {
          this.error_message = error.message;
          console.error('There was an error!', error);
          this.alertsService.errorAlert("Error getting client information.");
        }
      })
  }

  handleDeleteModalOpen(id: number) {
    this.resetForm();
    this.actual_client_id = id;
    this.modal_type = "delete"
    this.is_modal_open = true;

    this.clientsService.getClientById(id)
      .subscribe({
        next: (cliente: ICliente) => {
          const { id, ...rest } = cliente
          this.clientForm.patchValue({ ...rest });
        },
        error: error => {
          this.error_message = error.message;
          console.error('There was an error!', this.error_message);
        }
      })
  }

  handleSubmitModal() {
    this.renderer.selectRootElement(this.submit_button["nativeElement"]).click();
  }

  orderClientsByField(campo: any = { value: "id" }) {
    const filtered_field: "id" | "nome" | "email" = campo.value
    clients.sort((a, b) => {
      if (a[filtered_field]! < b[filtered_field]!) {
        return -1;
      }
      if (a[filtered_field]! > b[filtered_field]!) {
        return 1;
      }
      return 0;
    });
  }

  resetForm() {
    this.handleCloseModal();
    this.actual_client_id = 0;
    this.clientForm.patchValue(this.form_initial_value);
  }

  getAllClients() {
    this.clientsService.getAllClients().subscribe((clientes: ICliente[]) => {
      this.clients = clientes;
      this.orderClientsByField();
    });
  }

  handleClientCreation() {
    this.clientsService.createClient({
      ...this.clientForm.value,
    } as ICliente)
      .subscribe({
        next: data => {
          this.status = 'Creation successful';
          this.getAllClients();
          this.alertsService.successAlert(this.status);
          this.resetForm();
        },
        error: error => {
          this.error_message = error.message;
          console.error('There was an error!', this.error_message);
          this.alertsService.errorAlert("Error creating client");
        }
      });
  }

  handleClientUpdate() {
    this.clientsService.updateClientById({
      ...this.clientForm.value,
      id: this.actual_client_id
    } as ICliente)
      .subscribe({
        next: data => {
          this.status = 'Edition successful';
          this.getAllClients();
          this.alertsService.successAlert(this.status);
          this.resetForm();
        },
        error: error => {
          this.error_message = error.message;
          console.error('There was an error!', this.error_message);
          this.alertsService.errorAlert("Error updating client");
        }
      });
  }

  handleClientDeletion() {
    this.clientsService.deleteClientById(this.actual_client_id)
      .subscribe({
        next: data => {
          this.status = 'Delete successful';
          this.alertsService.successAlert(this.status);
          this.getAllClients();
          this.resetForm();
        },
        error: error => {
          this.error_message = error.message;
          console.error('There was an error!', error);
          this.alertsService.errorAlert("Error deleting client");
        }
      });
  }

  onSubmit() {
    if (!this.clientForm.valid) {
      if (this.modal_type === "delete") {
        this.handleClientDeletion();
        return;
      }
      this.alertsService.warningAlert("Invalid Form");
      return;
    }

    if (this.modal_type === "delete") {
      this.handleClientDeletion();
      return;
    }

    if (this.modal_type === "update") {
      this.handleClientUpdate();
      return;
    }

    if (this.modal_type === "create") {
      this.handleClientCreation();
    }
  }
}

export default clients