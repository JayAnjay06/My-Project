// export interface AiChat {
//   chat_id: number;
//   pertanyaan: string;
//   jawaban: string;
//   tanggal_chat: string;
//   user_id?: number | null;
// }

export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatResponse {
  status: string;
  data: {
    jawaban: string;
  };
}

export interface SendMessageData {
  user_id: number | null;
  pertanyaan: string;
}