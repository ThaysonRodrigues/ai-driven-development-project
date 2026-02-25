import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <header class="glass-header" style="padding: 12px 24px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <h1 style="font-size: 1.4rem; letter-spacing: -0.5px; color: var(--primary); font-weight: 800;">Vô-Lembrá</h1>
      </div>

      <nav *ngIf="api.isAuthenticated()" style="display: flex; gap: 8px; align-items: center; position: relative;">
        <a routerLink="/pacientes" routerLinkActive="active-nav" class="nav-link">
          <span class="material-symbols-outlined">groups</span> Pacientes
        </a>
        <a routerLink="/remedios" routerLinkActive="active-nav" class="nav-link">
          <span class="material-symbols-outlined">medication</span> Remedios
        </a>
        <a routerLink="/alertas" routerLinkActive="active-nav" class="nav-link">
          <span class="material-symbols-outlined">notifications</span> Alertas
        </a>
        
        <div style="width: 1px; height: 24px; background: var(--border); margin: 0 10px;"></div>
        
        <div style="position: relative;">
          <button (click)="toggleMenu()" class="user-button">
            <span class="material-symbols-outlined" style="font-size: 24px;">account_circle</span>
            <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ api.getUserName() || 'Usuário' }}</span>
            <span class="material-symbols-outlined" style="font-size: 18px; opacity: 0.6;">{{ isMenuOpen ? 'expand_less' : 'expand_more' }}</span>
          </button>

          <div *ngIf="isMenuOpen" class="dropdown-menu animate-fade">
            <button (click)="editProfile()" class="dropdown-item">
              <span class="material-symbols-outlined">manage_accounts</span> Editar Perfil
            </button>
            <div style="height: 1px; background: var(--border); margin: 4px 0;"></div>
            <button (click)="logout()" class="dropdown-item" style="color: var(--danger);">
              <span class="material-symbols-outlined">logout</span> Sair
            </button>
          </div>
        </div>
      </nav>
    </header>

    <main class="animate-fade" style="padding: 24px 40px;" (click)="isMenuOpen = false">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .nav-link {
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.95rem;
      padding: 8px 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-link:hover {
      color: var(--primary);
      background: var(--primary-light);
    }
    .nav-link.active-nav {
      color: var(--primary);
      background: var(--primary-light);
    }
    .nav-link .material-symbols-outlined {
      font-size: 20px;
    }
    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: white;
      border: 1px solid var(--border);
      border-radius: 20px;
      color: var(--text-main);
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: var(--shadow-sm);
    }
    .user-button:hover {
      border-color: var(--primary);
      background: var(--bg);
    }
    .dropdown-menu {
      position: absolute;
      top: 120%;
      right: 0;
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: var(--shadow-md);
      width: 200px;
      z-index: 1000;
      padding: 6px;
      display: flex;
      flex-direction: column;
    }
    .dropdown-item {
      padding: 10px 12px;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      color: var(--text-main);
      font-size: 0.9rem;
      font-weight: 500;
      border-radius: 8px;
    }
    .dropdown-item:hover {
      background: var(--primary-light);
      color: var(--primary);
    }
    .dropdown-item .material-symbols-outlined {
      font-size: 20px;
    }
  `]
})
export class AppComponent {
  title = 'Vô-Lembrá';
  isMenuOpen = false;

  constructor(public api: ApiService, private router: Router, private titleService: Title) {
    this.titleService.setTitle('Vô-Lembrá');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  editProfile() {
    this.isMenuOpen = false;
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.isMenuOpen = false;
    this.api.logout();
    this.router.navigate(['/login']);
  }
}
