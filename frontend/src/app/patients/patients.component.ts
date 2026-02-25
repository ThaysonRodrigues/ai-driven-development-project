import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Patient, Medicine, Schedule } from '../models'; // Schedule type might need update to match DTO

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade" style="display: flex; gap: 24px; height: calc(100vh - 160px); overflow: hidden;">
      <!-- Sidebar List -->
      <div class="card" style="width: 320px; padding: 0; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border);">
        <div style="padding: 20px; border-bottom: 1px solid var(--border); background: var(--surface);">
          <h3 style="margin-bottom: 16px; color: var(--text-main); font-size: 1.1rem; display: flex; align-items: center; gap: 10px;">
            <span class="material-symbols-outlined" style="color: var(--primary);">groups</span> Seus Pacientes
          </h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <input [(ngModel)]="newPatient.nome" placeholder="Nome do Paciente" 
              style="width: 100%; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem;">
            <div style="display: flex; gap: 8px;">
              <input type="date" [(ngModel)]="newPatient.dataNascimento" 
                style="flex: 1; padding: 10px; font-size: 0.85rem; border-radius: 8px;">
              <button (click)="createPatient()" 
                style="background: var(--primary); color: white; width: 42px; height: 42px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">
                <span class="material-symbols-outlined">person_add</span>
              </button>
            </div>
          </div>
        </div>
        
        <div style="overflow-y: auto; flex: 1; background: #fafbfc;">
          <div *ngFor="let p of patients" 
              (click)="selectPatient(p)"
              class="patient-item"
              [class.active]="selectedPatient?.id === p.id">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="avatar-circle">
                {{ p.nome.charAt(0).toUpperCase() }}
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">{{ p.nome }}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                  <span class="material-symbols-outlined" style="font-size: 14px;">calendar_today</span> {{ p.dataNascimento | date:'dd/MM/yyyy' }}
                </div>
              </div>
              <span *ngIf="selectedPatient?.id === p.id" class="material-symbols-outlined" style="color: var(--primary); font-size: 20px;">chevron_right</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Panel -->
      <div class="card animate-slide" style="flex: 1; padding: 0; overflow: hidden; display: flex; flex-direction: column;" *ngIf="selectedPatient">
        <!-- Panel Header -->
        <div style="padding: 24px 30px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--surface);">
          <div style="display: flex; align-items: center; gap: 20px;">
            <div class="avatar-large">{{ selectedPatient.nome.charAt(0).toUpperCase() }}</div>
            <div>
              <h2 style="font-size: 1.6rem; color: var(--text-main); margin-bottom: 4px;">{{ selectedPatient.nome }}</h2>
              <div style="display: flex; gap: 15px;">
                <span style="color: var(--text-muted); font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                  <span class="material-symbols-outlined" style="font-size: 16px;">celebration</span> {{ selectedPatient.dataNascimento | date:'dd/MM/yyyy' }}
                </span>
              </div>
            </div>
          </div>
          <button (click)="deletePatient(selectedPatient.id)" 
                  class="btn-outline-danger">
            <span class="material-symbols-outlined">delete</span> Remover Paciente
          </button>
        </div>
        
        <!-- Panel Content -->
        <div style="padding: 30px; overflow-y: auto; flex: 1; background: #fdfdfe;">
          <!-- Association Section -->
          <div style="background: var(--primary-light); border: 1px solid var(--primary); border-left-width: 4px; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h4 style="margin-bottom: 14px; color: var(--primary-dark); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; font-weight: 700;">
               <span class="material-symbols-outlined" style="font-size: 18px;">add_moderator</span> Prescrever Novo Medicamento
            </h4>
            <div style="display: flex; gap: 12px;">
              <select [(ngModel)]="selectedMedicineToAdd" style="flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--primary); font-weight: 500;">
                <option [value]="null" disabled selected>Localize um remédio no estoque...</option>
                <option *ngFor="let m of allMedicines" [value]="m.id">{{ m.nome }} - {{ m.dosagem }}</option>
              </select>
              <button (click)="addMedicineToPatient()" 
                      style="background: var(--primary); color: white; padding: 0 24px; font-weight: 600; border-radius: 8px; display: flex; align-items: center; gap: 8px; box-shadow: var(--shadow);">
                <span class="material-symbols-outlined">add_task</span> Vincular ao Paciente
              </button>
            </div>
          </div>

          <!-- List of Medicines -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h3 style="color: var(--text-main); font-size: 1.25rem; display: flex; align-items: center; gap: 12px;">
              <span class="material-symbols-outlined" style="color: var(--primary);">medication</span> Medicamentos Ativos
              <span class="count-tag">{{patientMedicines.length}}</span>
            </h3>
          </div>

          <div *ngIf="patientMedicines.length === 0" style="text-align: center; padding: 60px 40px; color: var(--text-muted); background: white; border-radius: var(--radius); border: 2px dashed var(--border);">
            <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;">medication_off</span>
            <p style="font-weight: 500;">Nenhum medicamento vinculado ainda.</p>
          </div>

          <div *ngFor="let link of patientMedicines" class="card medicine-card animate-slide" style="margin-bottom: 20px; padding: 0; overflow: hidden;">
            <div style="background: #f8fafc; padding: 16px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="pill-icon"><span class="material-symbols-outlined">pill</span></div>
                <strong style="color: var(--primary); font-size: 1.15rem; font-family: 'Outfit';">{{ getMedicineName(link.remedioId) }}</strong>
              </div>
              <button (click)="removeMedicineFromPatient(link.remedioId)" 
                      style="background: none; color: var(--danger); font-size: 0.8rem; font-weight: 600; padding: 6px 12px; display: flex; align-items: center; gap: 6px; border-radius: 6px;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='none'">
                <span class="material-symbols-outlined" style="font-size: 18px;">link_off</span> Suspender
              </button>
            </div>
            
            <div style="padding: 24px;">
               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                 <h4 style="margin: 0; color: var(--text-muted); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
                   <span class="material-symbols-outlined" style="font-size: 18px; color: var(--warning);">alarm</span> Cronograma de Administração
                 </h4>
               </div>
               
               <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
                 <div *ngFor="let s of getSchedulesForLink(link.id)" 
                      class="schedule-pill">
                   <span class="material-symbols-outlined" style="font-size: 18px; color: var(--primary);">schedule</span>
                   <span style="font-weight: 700;">{{ s.hora }}</span>
                   <span style="font-size: 0.75rem; color: var(--text-muted);">({{ s.recorrencia }})</span>
                   <button (click)="deleteSchedule(s.id)" class="close-pill">
                     <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
                   </button>
                 </div>
               </div>
               
               <div style="display: flex; gap: 12px; align-items: center; background: #f1f5f9; padding: 16px; border-radius: 12px;">
                 <div style="flex: 1; display: flex; gap: 10px;">
                   <div style="flex: 1;">
                     <label style="display: block; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; font-weight: 700;">Horário</label>
                     <input type="time" [(ngModel)]="newScheduleTime[link.id]" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">
                   </div>
                   <div style="flex: 1;">
                     <label style="display: block; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; font-weight: 700;">Frequência</label>
                     <select [(ngModel)]="newScheduleRecurrence[link.id]" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);">
                        <option value="DIARIO">Diário</option>
                        <option value="SEMANAL">Semanal</option>
                     </select>
                   </div>
                 </div>
                 <button (click)="addSchedule(link.id)" 
                   style="background: var(--surface); color: var(--primary); border: 1px solid var(--primary); height: 40px; padding: 0 20px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; margin-top: 18px; box-shadow: var(--shadow-sm);" onmouseover="this.style.background='var(--primary)'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='var(--primary)'">
                    <span class="material-symbols-outlined" style="font-size: 18px;">add_circle</span> Agendar
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card animate-fade" *ngIf="!selectedPatient" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); background: white;">
        <div style="background: var(--primary-light); padding: 30px; border-radius: 50%; margin-bottom: 24px;">
          <span class="material-symbols-outlined" style="font-size: 64px; color: var(--primary); opacity: 0.5;">person_search</span>
        </div>
        <h3 style="color: var(--text-main); margin-bottom: 8px;">Nenhum paciente selecionado</h3>
        <p style="font-size: 1rem; color: var(--text-muted); text-align: center; max-width: 300px;">Localize o paciente na barra lateral para ver seus cuidados e medicamentos.</p>
      </div>
    </div>
  `,
  styles: [`
    .patient-item {
      padding: 16px 20px;
      cursor: pointer;
      border-bottom: 1px solid var(--border);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .patient-item:hover {
      background: var(--primary-light);
    }
    .patient-item.active {
      background: white;
      border-left: 4px solid var(--primary);
      box-shadow: inset 0 0 10px rgba(0,0,0,0.02);
    }
    .avatar-circle {
      width: 40px;
      height: 40px;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-family: 'Outfit';
    }
    .avatar-large {
      width: 64px; height: 64px;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem; font-weight: 700; font-family: 'Outfit';
      box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
    }
    .btn-outline-danger {
      background: white; color: var(--danger); border: 1.5px solid var(--danger); 
      padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 0.85rem;
      display: flex; align-items: center; gap: 8px;
    }
    .btn-outline-danger:hover {
      background: var(--danger); color: white;
    }
    .count-tag {
      background: var(--primary); color: white; font-size: 0.7rem; 
      padding: 4px 10px; border-radius: 12px; font-weight: 700;
    }
    .medicine-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .medicine-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .pill-icon {
      width: 32px; height: 32px; background: white; border: 1px solid var(--border);
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      color: var(--primary);
    }
    .schedule-pill {
      background: white; border: 1px solid var(--border);
      padding: 8px 14px; border-radius: 12px; display: flex; align-items: center; 
      gap: 10px; font-size: 0.9rem; transition: border-color 0.2s;
    }
    .schedule-pill:hover { border-color: var(--primary); }
    .close-pill {
      background: #f1f5f9; color: var(--secondary); border: none; 
      width: 20px; height: 20px; border-radius: 50%; display: flex; 
      align-items: center; justify-content: center; cursor: pointer;
    }
    .close-pill:hover { background: var(--danger); color: white; }
  `]
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  allMedicines: Medicine[] = [];
  selectedPatient: Patient | null = null;
  patientMedicines: any[] = []; // PatientMedicineDTO
  patientSchedules: any[] = []; // ScheduleDTO

  newPatient: Partial<Patient> = { nome: '', dataNascimento: '' };
  selectedMedicineToAdd: number | null = null;

  // Helpers for forms
  newScheduleTime: { [key: number]: string } = {};
  newScheduleRecurrence: { [key: number]: string } = {};

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadPatients();
    this.loadAllMedicines();
  }

  loadPatients() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.api.getPatients(Number(userId)).subscribe(data => this.patients = data);
    }
  }

  loadAllMedicines() {
    this.api.getMedicines().subscribe(data => this.allMedicines = data);
  }

  createPatient() {
    const userId = localStorage.getItem('userId');
    if (!this.newPatient.nome || !userId) return;
    const p = { ...this.newPatient, responsavelId: Number(userId) } as Patient;
    this.api.createPatient(p).subscribe(() => {
      this.loadPatients();
      this.newPatient = { nome: '', dataNascimento: '' };
    });
  }

  deletePatient(id: number) {
    if (confirm('Tem certeza?')) {
      this.api.deletePatient(id).subscribe(() => {
        this.selectedPatient = null;
        this.loadPatients();
      });
    }
  }

  selectPatient(p: Patient) {
    this.selectedPatient = p;
    this.loadPatientDetails();
  }

  loadPatientDetails() {
    if (!this.selectedPatient) return;
    this.api.getPatientMedicines(this.selectedPatient.id).subscribe(data => {
      this.patientMedicines = data;
    });
    this.api.getSchedules(this.selectedPatient.id).subscribe(data => {
      this.patientSchedules = data;
    });
  }

  getMedicineName(id: number): string {
    const m = this.allMedicines.find(x => x.id === id);
    return m ? `${m.nome} (${m.dosagem})` : 'Desconhecido';
  }

  addMedicineToPatient() {
    if (!this.selectedPatient || !this.selectedMedicineToAdd) return;
    this.api.linkMedicine(this.selectedPatient.id, Number(this.selectedMedicineToAdd)).subscribe(() => {
      this.loadPatientDetails();
      this.selectedMedicineToAdd = null;
    });
  }

  removeMedicineFromPatient(remedioId: number) {
    if (!this.selectedPatient) return;
    this.api.removeMedicineLink(this.selectedPatient.id, remedioId)
      .subscribe(() => this.loadPatientDetails());
  }

  getSchedulesForLink(linkId: number) {
    return this.patientSchedules.filter(s => s.pacienteRemedioId === linkId);
  }

  addSchedule(linkId: number) {
    const time = this.newScheduleTime[linkId];
    const rec = this.newScheduleRecurrence[linkId] || 'DIARIO';
    if (!time) return;

    const schedule = {
      hora: time + ':00', // Append seconds if needed by LocalTime parsing
      recorrencia: rec,
      pacienteRemedioId: linkId
    };

    this.api.createSchedule(schedule).subscribe(() => {
      this.loadPatientDetails();
      this.newScheduleTime[linkId] = '';
    });
  }

  deleteSchedule(id: number) {
    this.api.deleteSchedule(id)
      .subscribe(() => this.loadPatientDetails());
  }
}
