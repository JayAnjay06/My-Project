export type UserRole = "peneliti" | "pemerintah" | "masyarakat";

export interface ForumUser {
  nama_lengkap?: string;
  role?: UserRole;
}

export interface ForumMessage {
  forum_id: number;
  user_id?: number | null;
  guest_name?: string | null;
  isi_pesan: string;
  created_at: string;
  user?: ForumUser;
}

export interface SendMessageData {
  isi_pesan: string;
  guest_name?: string;
}

export interface RoleInfo {
  label: string;
  color: string;
  icon: "flask" | "business" | "person";
  roleLabel: string;
}