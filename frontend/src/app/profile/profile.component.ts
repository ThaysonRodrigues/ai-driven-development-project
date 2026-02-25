import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { User } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-icon">
            <span class="material-symbols-outlined">manage_accounts</span>
          </div>
          <h1>Editar Perfil</h1>
          <p>Mantenha seus dados atualizados</p>
        </div>

        <div *ngIf="message" [class.success]="!isError" [class.error]="isError" class="status-box">
          <span class="material-symbols-outlined">{{ isError ? 'report' : 'check_circle' }}</span>
          {{ message }}
        </div>

        <div class="profile-form">
          <div class="form-field">
            <label>Nome Completo</label>
            <div class="input-box">
              <span class="material-symbols-outlined">person</span>
              <input type="text" [(ngModel)]="user.nome" placeholder="Seu nome completo">
            </div>
          </div>

          <div class="form-field">
            <label>E-mail</label>
            <div class="input-box">
              <span class="material-symbols-outlined">mail</span>
              <input type="email" [(ngModel)]="user.email" placeholder="seu@email.com">
            </div>
          </div>

          <div class="form-field">
            <label>Nova Senha</label>
            <p class="field-hint">Deixe vazio se não quiser alterar</p>
            <div class="input-box">
              <span class="material-symbols-outlined">lock</span>
              <input type="password" [(ngModel)]="newPassword" placeholder="Sua nova senha">
            </div>
          </div>

          <div class="actions">
            <button class="save-btn" (click)="save()" [disabled]="loading">
              <span *ngIf="!loading">Salvar Alterações</span>
              <span *ngIf="loading">Salvando...</span>
              <span class="material-symbols-outlined" [class.sync]="loading">
                {{ loading ? 'sync' : 'save' }}
              </span>
            </button>
            
            <button class="cancel-btn" (click)="cancel()">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      min-height: calc(100vh - 80px);
      display: flex; align-items: flex-start; justify-content: center;
      padding: 40px 20px; background: #f8fafc;
    }
    .profile-card {
      width: 100%; max-width: 500px;
      background: white; padding: 40px; border-radius: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }
    .profile-header { text-align: center; margin-bottom: 30px; }
    .profile-icon {
      width: 60px; height: 60px; background: var(--primary-gradient);
      color: white; border-radius: 16px; margin: 0 auto 16px;
      display: flex; align-items: center; justify-content: center;
    }
    .profile-header h1 { color: var(--text-main); font-size: 1.8rem; margin-bottom: 5px; }
    .profile-header p { color: var(--text-muted); font-size: 0.9rem; }
    
    .status-box {
      padding: 12px; border-radius: 12px; margin-bottom: 25px;
      display: flex; align-items: center; gap: 10px; font-size: 0.9rem; font-weight: 600;
      animation: fadeIn 0.3s ease;
    }
    .status-box.success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .status-box.error { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
    
    .form-field { margin-bottom: 20px; }
    .form-field label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px; }
    .field-hint { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px; margin-top: -4px; }
    
    .input-box {
      border: 2px solid #f1f5f9; background: #f8fafc; border-radius: 12px;
      display: flex; align-items: center; padding: 0 12px;
    }
    .input-box span { color: var(--text-muted); font-size: 20px; margin-right: 10px; }
    .input-box input { border: none; background: transparent; padding: 12px 0; width: 100%; outline: none; font-size: 1rem; }
    
    .actions { display: flex; gap: 12px; margin-top: 30px; }
    .save-btn {
      flex: 2; height: 52px; background: var(--primary-gradient); color: white; border: none;
      border-radius: 12px; font-weight: 700; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .cancel-btn {
      flex: 1; height: 52px; background: #f1f5f9; color: var(--text-main); border: none;
      border-radius: 12px; font-weight: 600; cursor: pointer;
    }
    .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    
    @keyframes spin { to { transform: rotate(360deg); } }
    .sync { animation: spin 1s linear infinite; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ProfileComponent implements OnInit {
  user: User = { id: 0, nome: '', email: '', tipoUsuario: '' };
  newPassword = '';
  loading = false;
  message = '';
  isError = false;

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      console.log('Carregando perfil para ID:', userId);
      this.api.getUser(Number(userId)).subscribe({
        next: (user) => {
          this.user = user;
          console.log('Perfil carregado:', user);
        },
        error: (err) => {
          console.error('Erro ao buscar usuário:', err);
          this.message = 'Erro ao carregar dados do usuário.';
          this.isError = true;
        }
      });
    } else {
      console.warn('Nenhum userId encontrado no localStorage');
      this.router.navigate(['/login']);
    }
  }

  save() {
    if (!this.user.nome || !this.user.email) {
      this.message = 'Nome e E-mail são obrigatórios.';
      this.isError = true;
      return;
    }

    this.loading = true;
    this.message = '';

    console.log('Salvando alterações do perfil...', this.user);

    this.api.updateUser(this.user.id, this.user, this.newPassword).subscribe({
      next: (updatedUser) => {
        console.log('Perfil atualizado com sucesso:', updatedUser);
        this.loading = false;
        this.message = 'Perfil atualizado com sucesso!';
        this.isError = false;

        // Atualiza o nome no storage para refletir no header
        localStorage.setItem('userName', updatedUser.nome);
        this.newPassword = '';

        setTimeout(() => {
          this.message = '';
          this.router.navigate(['/pacientes']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        this.loading = false;
        this.isError = true;
        if (err.status === 0) {
          this.message = 'Erro de conexão com o servidor.';
        } else {
          this.message = 'Erro ao salvar alterações. Tente novamente.';
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/pacientes']);
  }
}
