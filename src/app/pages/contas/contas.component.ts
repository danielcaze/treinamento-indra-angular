import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ICliente } from 'src/app/interfaces/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { ContasService } from 'src/app/services/contas.service';
import { IConta } from '../../interfaces/conta';

@Component({
  selector: 'app-contas',
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.css']
})
export class ContasComponent implements OnInit {

  status: string = "";
  errorMessage: string = "";

  accounts: IConta[] = [];

  actualAccountIdForEdition: number = 0;
  isModalForEditing: boolean = false;
  isClientFetched: boolean = false;

  formInitialValue: IConta = {
    agencia: "",
    numero: "",
    saldo: 0,
    cliente: {
      nome: "",
      email: "",
      cpf: "",
      observacoes: "",
      ativo: true,
      id: 0
    }
  }

  constructor(private contaService: ContasService, private clienteService: ClientesService, private fb: FormBuilder) { }

  accountForm = this.fb.group({
    agencia: ['', Validators.required],
    numero: ['', Validators.required],
    saldo: [0, Validators.required],
    cliente: this.fb.group({
      nome: [''],
      email: [''],
      cpf: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ]],
      observacoes: [''],
      ativo: [true],
      id: [0]
    })
  });

  ngOnInit(): void {
    this.getAllAccounts();
  }

  resetForm() {
    this.isModalForEditing = false;
    this.accountForm.patchValue(this.formInitialValue);
  }

  onSubmit() {
    if (!this.accountForm.valid) {
      alert("Formulario Invalido");
      return;
    }

    if (this.isModalForEditing) {
      this.handleAccountEdition();
      return;
    }

    this.handleAccountCreation();
  }

  getAllAccounts() {
    this.contaService.getAllAccounts().subscribe((accounts: IConta[]) => {
      this.accounts = accounts;
      this.orderAccountsByField();
    });
  }

  getAccountById(id: number) {
    this.isModalForEditing = true;
    this.actualAccountIdForEdition = id;
    this.accountForm.patchValue(this.formInitialValue);

    this.contaService.getAccountById(id).subscribe({
      next: (account: IConta) => {
        this.isClientFetched = true;

        const { numero, agencia, cliente, saldo } = account;

        this.accountForm.patchValue({
          numero,
          agencia,
          cliente,
          saldo
        });
      },
      error: error => {
        this.errorMessage = error.message;
        console.error(this.errorMessage);
        alert("Ocorreu um erro ao buscar as informacoes da conta")
      }
    })
  }

  orderAccountsByField(campo: any = { value: "id" }) {
    const filtered_field: "id" | "agencia" | "numero" | "saldo" = campo.value
    this.accounts.sort((a, b) => {
      if (a[filtered_field]! < b[filtered_field]!) {
        return -1;
      }
      if (a[filtered_field]! > b[filtered_field]!) {
        return 1;
      }
      return 0;
    });
  }

  // alterar isso esta bugando quando eh pra editar
  getClientForCreationOrEdition(cpf: any) {
    this.clienteService.getClientByCpf(cpf.value).subscribe({
      next: (cliente: ICliente) => {

        this.accountForm.patchValue({
          ...this.accountForm.value,
          cliente: {
            ...cliente
          }
        });

        this.isClientFetched = true;
      },
      error: error => {
        this.isClientFetched = false;
        this.errorMessage = error.message;
        console.error("There was an error!" + error.message);
        alert("Nao existe nenhuma conta vinculada a esse cpf!");
      }
    })
  }

  handleAccountCreation() {
    this.contaService.createAccount({
      ...this.accountForm.value
    } as IConta)
      .subscribe({
        next: data => {
          this.status = 'Creation successful';

          this.getAllAccounts();

          alert(this.status);

          const close_button: any = document.querySelector('#btn-close');
          close_button!.click();

          this.accountForm.patchValue(this.formInitialValue);
          this.isClientFetched = false;
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      });
  }

  handleAccountEdition() {
    this.contaService.updateAccountById(this.actualAccountIdForEdition, {
      ...this.accountForm.value,
    } as IConta)
      .subscribe({
        next: data => {
          this.status = 'Edition successful';

          this.getAllAccounts();

          alert(this.status);

          const close_button: any = document.querySelector('#btn-close');
          close_button!.click();

          this.accountForm.patchValue(this.formInitialValue);

          this.isModalForEditing = false;
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      });
  }

  handleAccountDeletion(id: number) {
    this.contaService.deleteAccountById(id)
      .subscribe({
        next: data => {
          this.status = 'Delete successful';
          alert(this.status)
          this.getAllAccounts();
        },
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
        }
      });
  }
}
