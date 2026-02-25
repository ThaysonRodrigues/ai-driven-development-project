import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Medicine } from '../models';

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade" style="padding: 24px 0; max-width: 1000px; margin: 0 auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px;">
        <h2 style="font-size: 1.8rem; color: var(--text-main); display: flex; align-items: center; gap: 12px;">
          <span class="material-symbols-outlined" style="font-size: 32px; color: var(--primary);">inventory_2</span> 
          Estoque de Medicamentos
        </h2>
        <div class="count-tag" style="padding: 6px 16px; font-size: 0.9rem; font-weight: 700; background: var(--primary-light); color: var(--primary); border-radius: 30px; border: 1px solid var(--primary);">
          {{medicines.length}} Itens
        </div>
      </div>
      
      <div class="card" style="margin-bottom: 40px; padding: 30px; border-top: 4px solid var(--primary);">
        <h4 style="margin-bottom: 20px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; font-weight: 700;">
          {{ isEditing ? 'Editar Medicamento' : 'Cadastrar Novo Item' }}
        </h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 15px; align-items: end;">
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">Nome</label>
            <input [(ngModel)]="newMedicine.nome" placeholder="Ex: Paracetamol" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">Dosagem</label>
            <input [(ngModel)]="newMedicine.dosagem" placeholder="Ex: 500mg" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">Observações</label>
            <input [(ngModel)]="newMedicine.observacoes" placeholder="Instruções de uso" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
          </div>
          <button (click)="isEditing ? saveEdit() : addMedicine()" 
                  style="background: var(--primary); color: white; height: 45px; padding: 0 25px; font-weight: 600; border-radius: 8px; border: none; display: flex; align-items: center; gap: 10px; box-shadow: var(--shadow); cursor: pointer;">
            <span class="material-symbols-outlined">{{ isEditing ? 'save' : 'add_circle' }}</span> 
            {{ isEditing ? 'Salvar' : 'Adicionar' }}
          </button>
          <button *ngIf="isEditing" (click)="cancelEdit()" 
                  style="background: white; color: var(--text-muted); height: 45px; padding: 0 15px; font-weight: 600; border-radius: 8px; border: 1px solid var(--border); display: flex; align-items: center; gap: 5px; cursor: pointer;">
            Cancelar
          </button>
        </div>
      </div>

      <div *ngIf="medicines.length === 0" class="animate-fade" style="text-align: center; padding: 80px 40px; color: var(--text-muted); background: white; border-radius: var(--radius); border: 2px dashed var(--border);">
        <span class="material-symbols-outlined" style="font-size: 64px; opacity: 0.2; margin-bottom: 20px;">medication</span>
        <p style="font-size: 1.1rem; font-weight: 500;">Sua farmácia está vazia. Adicione remédios acima para começar.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
        <div *ngFor="let m of medicines" 
             class="card medicine-card animate-slide" 
             style="padding: 0; position: relative; overflow: hidden; border: 1px solid var(--border);">
          
          <div class="card-actions">
            <button (click)="startEdit(m)" class="edit-btn" title="Editar">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button (click)="deleteMedicine(m.id)" class="delete-btn" title="Excluir">
              <span class="material-symbols-outlined">delete_forever</span>
            </button>
          </div>

          <div style="padding: 24px;">
            <div style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 15px;">
              <div class="pill-badge">
                <span class="material-symbols-outlined" style="font-size: 24px;">pill</span>
              </div>
              <div style="flex: 1;">
                <h3 style="font-size: 1.25rem; line-height: 1.2; margin-bottom: 4px; color: var(--text-main); font-weight: 600;">{{ m.nome }}</h3>
                <span class="dosage-tag">{{ m.dosagem }}</span>
              </div>
            </div>
            
            <div *ngIf="m.observacoes" style="background: #f8fafc; padding: 12px; border-radius: 8px; border-left: 3px solid var(--border);">
              <p style="margin: 0; color: var(--text-muted); font-size: 0.85rem; font-style: italic;">
                "{{ m.observacoes }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .medicine-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .medicine-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--primary) !important;
    }
    .pill-badge {
      width: 48px; height: 48px; background: var(--primary-light); 
      color: var(--primary); border-radius: 12px; display: flex; 
      align-items: center; justify-content: center;
    }
    .dosage-tag {
      display: inline-block; background: #f1f5f9; color: var(--secondary); 
      padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; 
      font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .card-actions {
      position: absolute; top: 12px; right: 12px; display: flex; gap: 8px; 
      z-index: 2; opacity: 0; transition: all 0.2s;
    }
    .medicine-card:hover .card-actions {
      opacity: 1;
    }
    .delete-btn, .edit-btn {
      background: white; color: var(--text-muted); width: 32px; height: 32px; 
      border-radius: 50%; display: flex; align-items: center; justify-content: center; 
      box-shadow: var(--shadow-sm); border: 1px solid var(--border); cursor: pointer;
      transition: all 0.2s;
    }
    .delete-btn:hover { background: var(--danger); color: white; border-color: var(--danger); transform: scale(1.1); }
    .edit-btn:hover { background: var(--primary); color: white; border-color: var(--primary); transform: scale(1.1); }
    .edit-btn span, .delete-btn span { font-size: 18px; }
  `]
})
export class MedicinesComponent implements OnInit {
  medicines: Medicine[] = [];
  newMedicine: Medicine = { id: 0, nome: '', dosagem: '', observacoes: '' };
  isEditing = false;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadMedicines();
  }

  loadMedicines() {
    this.api.getMedicines().subscribe(data => this.medicines = data);
  }

  addMedicine() {
    if (!this.newMedicine.nome) return;
    this.api.createMedicine(this.newMedicine).subscribe(() => {
      this.loadMedicines();
      this.resetForm();
    });
  }

  startEdit(medicine: Medicine) {
    this.isEditing = true;
    this.newMedicine = { ...medicine };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  saveEdit() {
    if (!this.newMedicine.nome) return;
    this.api.updateMedicine(this.newMedicine.id, this.newMedicine).subscribe(() => {
      this.loadMedicines();
      this.resetForm();
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.isEditing = false;
    this.newMedicine = { id: 0, nome: '', dosagem: '', observacoes: '' };
  }

  deleteMedicine(id: number) {
    if (confirm('Deseja excluir este medicamento?')) {
      this.api.deleteMedicine(id).subscribe(() => this.loadMedicines());
    }
  }
}
