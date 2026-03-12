import { Component, inject } from '@angular/core';
import { Login } from '../../models/Login';
import { CryptoService } from '../../services/crypto-service';
import { ThemeService } from '../../services/theme-service/theme-service.service';
import { LoginCardComponent } from "../login-card/login-card.component";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-list-logins',
  standalone: true,
  imports: [ModalComponent, LoginCardComponent],
  templateUrl: './list-logins.component.html',
  styleUrl: './list-logins.component.css'
})
export class ListLoginsComponent {
  themeService = inject(ThemeService);
  cryptoService = inject(CryptoService);
  showModal = false  
  

 loginsList: Login[] | null = [
    {
        "id": "-NpfPgrANpzwevA7q6lI",
        "password": "r/3aZHNwsJnlHWr39CMZHWKxzrWS83FpJ79htT1DmC4OzFctCXuGRr8=",
        "plataformName": "google",
        "user": "amber.lilith.ordone@gmail.com"
      },
      {
        "id": "-NpfPgrANpzwevA7q6l2",
        "password": "T6nKuiaru2AeP0jeUj3nJIM/hPBLh4i//YtBKHhE8hkGGYGY",
        "plataformName": "terra",
        "user": "amber.lilith.ordone@gmail.com"
      },
      {
        "id": "-NpfPgrANpzwevA7q6l3",
        "password": "PaIpk4xiMSFL3L97lj9K2ouLxWRpffO0TLoYA+Z4S8c6p7tA",
        "plataformName": "yahoo",
        "user": "amber.lilith.ordone@gmail.com"
      },
      {
        "id": "-NpfPgrANpzwevA7q6l4",
        "password": "chy0tP0nBe8+I4JII4zw+tiAi24MZ0F0YhdJckO8haf4AXqJVhjNFiLBDA==",
        "plataformName": "uol",
        "user": "amber.lilith.ordone@gmail.com"
      }
    ]

    loginsListToShow :  Login[] | null = []

  async ngOnInit(){
    this.loginsListToShow = this.loginsList
  }

  getLoginByPlataformName(searchTerm: string): void {
  const term = searchTerm.trim().toLowerCase();

  this.loginsListToShow = !term
    ? this.loginsList
    : (this.loginsList ?? []).filter(login =>
        login.plataformName.toLowerCase().includes(term)
      );
}  
}
