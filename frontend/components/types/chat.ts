export interface AiChat {
  chat_id: number;
  pertanyaan: string;
  jawaban: string;
  tanggal_chat: string;
  user_id?: number | null;
}
