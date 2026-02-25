import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-circle" style="background: var(--primary-gradient);">
            <span class="material-symbols-outlined">person_add</span>
          </div>
          <h1 style="color: var(--primary);">Criar Conta</h1>
          <p>Junte-se ao Vô-Lembrá</p>
        </div>

        <div *ngIf="error" class="login-error">
          <span class="material-symbols-outlined">report</span>
          {{ error }}
        </div>

        <div *ngIf="success" class="login-success">
          <span class="material-symbols-outlined">check_circle</span>
          Conta criada! Redirecionando...
        </div>

        <div class="login-form" *ngIf="!success">
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
            <label>Senha</label>
            <div class="input-box">
              <span class="material-symbols-outlined">lock</span>
              <input type="password" [(ngModel)]="user.senha" placeholder="Mínimo 6 caracteres">
            </div>
          </div>

          <button class="login-btn" style="background: var(--primary-gradient);" (click)="onRegister()" [disabled]="loading">
            <span *ngIf="!loading">Finalizar Cadastro</span>
            <span *ngIf="loading">Criando Conta...</span>
            <span class="material-symbols-outlined" [class.sync]="loading">
              {{ loading ? 'sync' : 'arrow_forward' }}
            </span>
          </button>
        </div>

        <div class="login-footer">
          <span>Já tem conta?</span>
          <a routerLink="/login">Faça login agora</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: radial-gradient(circle at center, #f8fafc 0%, #eef2ff 100%);
      z-index: 1000; overflow-y: auto; padding: 20px;
    }
    .login-card {
      width: 100%; max-width: 400px;
      background: white; padding: 40px; border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.06);
      animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .login-header { text-align: center; margin-bottom: 30px; }
    .logo-circle {
      width: 60px; height: 60px; color: white; border-radius: 16px; margin: 0 auto 16px;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-circle span { font-size: 32px; }
    .login-header h1 { font-size: 1.8rem; margin-bottom: 5px; }
    .login-header p { color: var(--text-muted); font-size: 0.9rem; }
    
    .login-error {
      background: #fef2f2; color: #dc2626; padding: 12px; border-radius: 12px;
      margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
      font-size: 0.85rem; font-weight: 600; border: 1px solid #fee2e2;
    }
    .login-success {
      background: #f0fdf4; color: #166534; padding: 12px; border-radius: 12px;
      margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
      font-size: 0.85rem; font-weight: 600; border: 1px solid #bbf7d0;
    }
    
    .form-field { margin-bottom: 20px; }
    .form-field label { display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px; }
    .input-box {
      border: 2px solid #f1f5f9; background: #f8fafc; border-radius: 12px;
      display: flex; align-items: center; padding: 0 12px; transition: all 0.2s;
    }
    .input-box span { color: var(--text-muted); font-size: 20px; margin-right: 10px; }
    .input-box input { border: none; background: transparent; padding: 12px 0; width: 100%; outline: none; font-size: 1rem; }
    
    .login-btn {
      width: 100%; height: 54px; margin-top: 10px;
      color: white; border: none;
      border-radius: 14px; font-weight: 700; font-size: 1rem;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      cursor: pointer; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3); }
    
    @keyframes spin { to { transform: rotate(360deg); } }
    .sync { animation: spin 1s linear infinite; }
    
    .login-footer { text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 25px; font-size: 0.9rem; }
    .login-footer a { color: var(--primary); font-weight: 700; margin-left: 8px; }
    
    @keyframes slideUp { 
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class RegisterComponent {
  user = { nome: '', email: '', senha: '', tipoUsuario: 'RESPONSAVEL' };
  error = '';
  success = false;
  loading = false;

  constructor(private api: ApiService, private router: Router) { }

  onRegister() {
    if (!this.user.nome || !this.user.email || !this.user.senha) {
      this.error = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.register(this.user).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Sem conexão com o servidor.';
        } else {
          this.error = 'Erro ao criar conta. Tente outro e-mail.';
        }
      }
    });
  }
}
