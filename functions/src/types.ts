export interface AgreementDoc {
  token: string;
  status: 'sent' | 'signed';
  clientName: string | null;
  clientEmail: string;
  terms: Record<string, string>;
  addendum: string;
  owner: Record<string, string> | null;
  acks: Record<string, boolean> | null;
  sigName: string | null;
  sigDate: string | null;
  sigData: string | null;   // signature PNG data URL
  signedAt: string | null;  // ISO
  createdAt: string;        // ISO
  pdfPath: string | null;   // Storage path of the executed PDF
}
export interface PortalSettings { notifyEmail: string; fromEmail: string; }
export interface PublicAgreementView {
  status: 'sent' | 'signed';
  clientName: string | null;
  clientEmail: string;
  terms: Record<string, string>;
  addendum: string;
  owner: Record<string, string> | null;
  acks: Record<string, boolean> | null;
  sigName: string | null;
  sigDate: string | null;
  sigData: string | null;
  signedAt: string | null;
}
