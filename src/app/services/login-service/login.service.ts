import { Injectable, inject } from '@angular/core';
import { Database, ref, set, remove, update, listVal } from '@angular/fire/database';
import { AuthService } from '../auth-service/auth.service';
import { Login } from '../../models/Login';
import { CryptoService } from '../crypto-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private db = inject(Database);
  private authService = inject(AuthService);
  private cryptoService = inject(CryptoService);

  private getBasePath(): string {
    const uid = this.authService.getCurrentUser()?.uid;
    if (!uid) throw new Error('Usuário não autenticado');
    return `${uid}/logins`;
  }

  // Agora retorna um Observable que atualiza automaticamente
  getAll(): Observable<Login[]> {
    const loginsRef = ref(this.db, this.getBasePath());
    return listVal<Login>(loginsRef);
  }

  async create(login: Omit<Login, 'id'>): Promise<void> {
    const newId = crypto.randomUUID();
    const encryptedPassword = await this.cryptoService.encrypt(login.password);
    const newLogin: Login = { ...login, id: newId, password: encryptedPassword };
    await set(ref(this.db, `${this.getBasePath()}/${newId}`), newLogin);
  }

  async update(id: string, login: Partial<Login>): Promise<void> {
    if (login.password) {
      login.password = await this.cryptoService.encrypt(login.password);
    }
    await update(ref(this.db, `${this.getBasePath()}/${id}`), login);
  }

  async delete(id: string): Promise<void> {
    await remove(ref(this.db, `${this.getBasePath()}/${id}`));
  }
}