import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-circle">
            <span class="material-symbols-outlined">health_metrics</span>
          </div>
          <h1 style="color: var(--text-main);">Vô-Lembrá</h1>
          <p>Seu assistente de saúde</p>
        </div>

        <div *ngIf="error" class="login-error">
          <span class="material-symbols-outlined">report</span>
          {{ error }}
        </div>

        <div class="login-form">
          <div class="form-field">
            <label>E-mail</label>
            <div class="input-box">
              <span class="material-symbols-outlined">mail</span>
              <input type="email" [(ngModel)]="credentials.email" placeholder="email@exemplo.com">
            </div>
          </div>

          <div class="form-field">
            <label>Senha</label>
            <div class="input-box">
              <span class="material-symbols-outlined">lock</span>
              <input type="password" [(ngModel)]="credentials.senha" placeholder="Sua senha">
            </div>
          </div>

          <button class="login-btn" (click)="onLogin()" [disabled]="loading">
            <span *ngIf="!loading">Entrar na Conta</span>
            <span *ngIf="loading">Autenticando...</span>
            <span class="material-symbols-outlined" [class.sync]="loading">
              {{ loading ? 'sync' : 'arrow_forward' }}
            </span>
          </button>
        </div>

        <div class="login-footer">
          <span>Não tem conta?</span>
          <a routerLink="/registrar">Cadastre-se aqui</a>
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
      width: 60px; height: 60px; background: var(--primary-gradient);
      color: white; border-radius: 16px; margin: 0 auto 16px;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-circle span { font-size: 32px; }
    .login-header h1 { color: var(--primary); font-size: 1.8rem; margin-bottom: 5px; }
    .login-header p { color: var(--text-muted); font-size: 0.9rem; }
    
    .login-error {
      background: #fef2f2; color: #dc2626; padding: 12px; border-radius: 12px;
      margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
      font-size: 0.85rem; font-weight: 600; border: 1px solid #fee2e2;
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
      background: var(--primary-gradient); color: white; border: none;
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
export class LoginComponent implements OnInit {
  credentials = { email: '', senha: '' };
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.api.logout();
  }

  onLogin() {
    if (!this.credentials.email || !this.credentials.senha) {
      this.error = 'Por favor, informe seu e-mail e senha.';
      return;
    }

    this.loading = true;
    this.error = '';

    console.log('Iniciando login para:', this.credentials.email);

    this.api.login(this.credentials).subscribe({
      next: (res) => {
        console.log('Login bem-sucedido:', res);
        this.api.setToken(res.token);
        localStorage.setItem('userId', String(res.userId));
        localStorage.setItem('userName', res.userName || 'Usuário');

        this.router.navigate(['/pacientes']).then(success => {
          this.loading = false;
          if (!success) {
            console.error('Falha ao navegar para /pacientes');
            this.error = 'Login ok, mas falha ao abrir o dashboard.';
          }
        });
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Sem conexão com o servidor. Verifique o backend.';
        } else if (err.status === 401 || err.status === 403) {
          this.error = 'E-mail ou senha inválidos.';
        } else {
          this.error = 'Erro inesperado. Tente novamente.';
        }
      }
    });
  }
}
