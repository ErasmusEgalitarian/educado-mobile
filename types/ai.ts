export type Sender = "User" | "Chatbot";

export interface ChatMessage {
  sender: Sender;
  text: string;
  audio?: string;
}

export interface AudioResponse {
  message: string;
  aiResponse: string;
  audio: string;
}
