export interface AgreementRow {
  token: string;
  status: 'sent' | 'signed';
  clientName: string | null;
  clientEmail: string;
  terms: Record<string, string>;
  createdAt: string;
  signedAt: string | null;
  sigName: string | null;
}

export interface Settings {
  notifyEmail: string;
  fromEmail: string;
  hasResendKey: boolean;
}
