export interface User {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: string;
}

export interface Patient {
  id: number;
  nome: string;
  dataNascimento: string;
  responsavelId: number;
}

export interface Medicine {
  id: number;
  nome: string;
  dosagem: string;
  observacoes?: string;
}

export interface Schedule {
  id: number;
  hora: string;
  recorrencia: string;
  pacienteRemedioId: number;
}

export interface Alert {
  id: number;
  dataHoraDisparo: string;
  status: string;
  horarioId: number;
  pacienteNome: string;
  remedioNome: string;
}

export interface LoginResponse {
  token: string;
  tipoUsuario: string;
  userId: number;
  userName?: string;
}
