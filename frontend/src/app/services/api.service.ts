import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse, User, Patient, Medicine, Schedule, Alert } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private apiUrl = 'http://localhost:8080/api';
    private token: string | null = null;

    constructor(private http: HttpClient) { }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('token');
        }
        return this.token;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
    }

    getUserName(): string | null {
        return localStorage.getItem('userName');
    }

    // Users
    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/usuarios/${id}`, this.getHeaders());
    }

    updateUser(id: number, user: User, password?: string): Observable<User> {
        const url = password ? `${this.apiUrl}/usuarios/${id}?password=${password}` : `${this.apiUrl}/usuarios/${id}`;
        return this.http.put<User>(url, user, this.getHeaders());
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getHeaders() {
        let headers = new HttpHeaders();
        const token = this.getToken();
        if (token) {
            headers = headers.set('Authorization', 'Bearer ' + token);
        }
        return { headers };
    }

    login(credentials: any): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
    }

    register(user: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/auth/register?password=${user.senha}`, user);
    }

    // Patients
    getPatients(responsavelId: number): Observable<Patient[]> {
        return this.http.get<Patient[]>(`${this.apiUrl}/pacientes?responsavelId=${responsavelId}`, this.getHeaders());
    }

    createPatient(patient: Patient): Observable<Patient> {
        return this.http.post<Patient>(`${this.apiUrl}/pacientes`, patient, this.getHeaders());
    }

    updatePatient(id: number, patient: Patient): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/pacientes/${id}`, patient, this.getHeaders());
    }

    deletePatient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/pacientes/${id}`, this.getHeaders());
    }

    // Medicines
    getMedicines(): Observable<Medicine[]> {
        return this.http.get<Medicine[]>(`${this.apiUrl}/remedios`, this.getHeaders());
    }

    createMedicine(medicine: Medicine): Observable<Medicine> {
        return this.http.post<Medicine>(`${this.apiUrl}/remedios`, medicine, this.getHeaders());
    }

    updateMedicine(id: number, medicine: Medicine): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/remedios/${id}`, medicine, this.getHeaders());
    }

    deleteMedicine(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/remedios/${id}`, this.getHeaders());
    }

    // Patient Medicines
    linkMedicine(patientId: number, medicineId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/pacientes/${patientId}/remedios?remedioId=${medicineId}`, {}, this.getHeaders());
    }

    getPatientMedicines(patientId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/pacientes/${patientId}/remedios`, this.getHeaders());
    }

    // Schedules
    getSchedules(patientId: number): Observable<Schedule[]> {
        return this.http.get<Schedule[]>(`${this.apiUrl}/pacientes/${patientId}/horarios`, this.getHeaders());
    }

    createSchedule(schedule: any): Observable<Schedule> {
        return this.http.post<Schedule>(`${this.apiUrl}/horarios`, schedule, this.getHeaders());
    }

    deleteSchedule(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/horarios/${id}`, this.getHeaders());
    }

    removeMedicineLink(patientId: number, medicineId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/pacientes/${patientId}/remedios/${medicineId}`, this.getHeaders());
    }

    // Alerts
    getAlerts(): Observable<Alert[]> {
        return this.http.get<Alert[]>(`${this.apiUrl}/alertas`, this.getHeaders());
    }

    confirmAlert(id: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/alertas/${id}/confirmar`, {}, this.getHeaders());
    }
}
