import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Alert } from '../models';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <audio #notificationSound src="assets/notification.mp3" preload="auto"></audio>
    <div style="padding: 24px 0; max-width: 900px; margin: 0 auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px;">
        <h2 style="font-size: 1.8rem; color: var(--text-main); display: flex; align-items: center; gap: 12px;">
          <span class="material-symbols-outlined" style="font-size: 32px; color: var(--primary);">notifications_active</span> 
          Histórico de Alertas
        </h2>
        <button (click)="loadAlerts()" class="btn-refresh">
          <span class="material-symbols-outlined">refresh</span> Atualizar
        </button>
      </div>

      <div *ngIf="alerts.length === 0" class="card" style="text-align: center; padding: 60px 40px; color: var(--text-muted);">
        <span class="material-symbols-outlined" style="font-size: 64px; opacity: 0.2; margin-bottom: 20px;">notifications_off</span>
        <p style="font-size: 1.1rem; font-weight: 500;">Nenhum alerta disparado recentemente.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div *ngFor="let a of alerts; trackBy: trackByAlertId" 
             class="card alert-card" 
             [class.pending]="a.status === 'PENDENTE'"
             [class.done]="a.status === 'TOMADO'"
             [class.missed]="a.status === 'NÃO TOMADO'">
          
          <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
            <div class="status-icon" 
                 [class.pending]="a.status === 'PENDENTE'" 
                 [class.done]="a.status === 'TOMADO'"
                 [class.missed]="a.status === 'NÃO TOMADO'">
              <span class="material-symbols-outlined">
                {{ a.status === 'PENDENTE' ? 'alarm_on' : (a.status === 'TOMADO' ? 'check_circle' : 'event_busy') }}
              </span>
            </div>
            
            <div style="flex: 1;">
              <div style="font-weight: 700; color: var(--text-main); font-size: 1.1rem; margin-bottom: 4px; font-family: 'Outfit';">
                {{ a.remedioNome }} - {{ a.dataHoraDisparo | date:'HH:mm' }}
              </div>
              <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <span class="status-badge" 
                      [class.pending]="a.status === 'PENDENTE'" 
                      [class.done]="a.status === 'TOMADO'"
                      [class.missed]="a.status === 'NÃO TOMADO'">
                  {{ a.status }}
                </span>
                <span style="color: var(--text-muted); font-size: 0.85rem; display: flex; align-items: center; gap: 4px; border-left: 1px solid var(--border); padding-left: 12px; font-weight: 600;">
                  <span class="material-symbols-outlined" style="font-size: 18px; color: var(--primary);">person</span>
                  {{ a.pacienteNome }}
                </span>
                <span style="color: var(--text-muted); font-size: 0.8rem; display: flex; align-items: center; gap: 4px; border-left: 1px solid var(--border); padding-left: 12px;">
                  <span class="material-symbols-outlined" style="font-size: 16px;">calendar_today</span>
                  {{ a.dataHoraDisparo | date:'dd MMM' }}
                </span>
              </div>
            </div>
          </div>
          
          <div style="padding-left: 20px; border-left: 1px solid var(--border);">
            <button *ngIf="a.status === 'PENDENTE'" 
                    (click)="confirmAlert(a.id)" 
                    class="btn-confirm">
              <span class="material-symbols-outlined">how_to_reg</span> Confirmar Uso
            </button>
            <div *ngIf="a.status === 'TOMADO'" class="done-label">
              <span class="material-symbols-outlined" style="font-size: 20px;">verified</span> 
              <span>Concluído</span>
            </div>
            <div *ngIf="a.status === 'NÃO TOMADO'" class="missed-label">
              <span class="material-symbols-outlined" style="font-size: 20px;">error</span> 
              <span>Não Tomado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-refresh {
      background: white; color: var(--primary); border: 1.5px solid var(--primary);
      padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
      display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s;
    }
    .btn-refresh:hover { background: var(--primary-light); }
    
    .alert-card {
      padding: 20px 24px; display: flex; justify-content: space-between; 
      align-items: center; transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid var(--border);
    }
    .alert-card:hover { transform: translateX(4px); box-shadow: var(--shadow-sm); }
    .alert-card.pending { border-left: 5px solid var(--warning); }
    .alert-card.done { border-left: 5px solid var(--success); }
    .alert-card.missed { border-left: 5px solid var(--danger); background: #fff1f2; }
    
    .status-icon {
      width: 48px; height: 48px; border-radius: 12px; display: flex; 
      align-items: center; justify-content: center;
    }
    .status-icon.pending { background: #fff7ed; color: var(--warning); }
    .status-icon.done { background: #f0fdf4; color: var(--success); }
    .status-icon.missed { background: #ffe4e6; color: var(--danger); }
    .status-icon span { font-size: 28px; }
    
    .status-badge {
      font-size: 0.7rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .status-badge.pending { background: #fed7aa; color: #9a3412; }
    .status-badge.done { background: #bbf7d0; color: #166534; }
    .status-badge.missed { background: #fecdd3; color: #9f1239; }
    
    .btn-confirm {
      background: var(--success); color: white; border: none; padding: 10px 20px; 
      border-radius: 8px; font-weight: 700; font-size: 0.85rem; display: flex; 
      align-items: center; gap: 8px; cursor: pointer; box-shadow: var(--shadow-sm);
    }
    .btn-confirm:hover { background: #15803d; transform: translateY(-1px); }
    
    .done-label {
      color: var(--success); font-weight: 700; font-size: 0.9rem; 
      display: flex; align-items: center; gap: 6px; padding: 8px 16px;
      background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;
    }

    .missed-label {
      color: var(--danger); font-weight: 700; font-size: 0.9rem; 
      display: flex; align-items: center; gap: 6px; padding: 8px 16px;
      background: #fff1f2; border-radius: 8px; border: 1px solid #fecdd3;
    }
  `]
})
export class AlertsComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private destroy$ = new Subject<void>();
  private lastAlertIds = new Set<number>();

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadAlerts();

    // Auto-refresh every 10 seconds
    interval(10000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadAlerts();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAlerts() {
    this.api.getAlerts().subscribe(data => {
      const sortedData = data.sort((a, b) => b.dataHoraDisparo.localeCompare(a.dataHoraDisparo));

      // Check for strictly NEW alerts (IDs we haven't seen yet in this session)
      const currentIds = new Set(sortedData.map(a => a.id));

      if (this.lastAlertIds.size > 0) {
        const hasNewAlert = sortedData.some(a => !this.lastAlertIds.has(a.id));
        if (hasNewAlert) {
          this.playNotification();
        }
      }

      // Initialize or update the set of known IDs
      this.lastAlertIds = currentIds;

      const hasChanges = JSON.stringify(this.alerts) !== JSON.stringify(sortedData);
      if (hasChanges) {
        this.alerts = sortedData;
      }
    });
  }

  private playNotification() {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.play().catch(err => console.log('Erro ao reproduzir som (pode ser bloqueio do navegador):', err));
    }
  }

  trackByAlertId(index: number, item: Alert) {
    return item.id;
  }

  confirmAlert(id: number) {
    this.api.confirmAlert(id).subscribe(() => this.loadAlerts());
  }
}
