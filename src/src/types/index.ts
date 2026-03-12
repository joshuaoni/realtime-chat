export interface Message {
  id: string;
  sender: string;
  text: string;
  createdAt: string;
  isSystem?: boolean;
}