import { Injectable } from '@angular/core';
import { Message } from './model/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl: string = 'http://127.0.0.1:8002/api';

  async getMessagesByUserId(userId: number): Promise<Message[]> {
    const url: string = `${this.baseUrl}/messages/${userId}`;
    const response: Response = await fetch(url);
    const messages: Message[] = await response.json();
    return messages;
  }

  async sendMessage(senderId: number, receiverId: number, text: string): Promise<Message> {
    const url: string = `${this.baseUrl}/messages/add`;
    const response: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderId,
        receiver: receiverId,
        text: text,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const message: Message = await response.json();
    return message;
  }
}
