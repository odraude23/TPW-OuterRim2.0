import { Component, inject } from '@angular/core';
import { MessageService } from '../messages.service';
import { CurrentUserService } from '../current-user.service';
import { Message } from '../model/message';
import { User } from '../model/user';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  private messageService = inject(MessageService);
  private currentUserService = inject(CurrentUserService);

  messages: Message[] = [];
  contacts: User[] = [];
  selectedUser: User | null = null;
  currentUser: User | null = null;
  chatMessages: Message[] = [];
  newMessageText: string = '';

  constructor() {
    this.init();
  }

  async init() {
    // Fetch the current user
    this.currentUser = await this.currentUserService.getCurrentUser();

    if (this.currentUser) {
      // Fetch messages involving the current user
      this.messages = await this.messageService.getMessagesByUserId(
        this.currentUser.id
      );

      // Extract contacts from messages
      this.contacts = this.extractContacts(this.messages, this.currentUser);
    }
  }

  extractContacts(messages: Message[], currentUser: User): User[] {
    const contactsMap: Map<number, User> = new Map();

    messages.forEach((message) => {
      if (message.sender.id !== currentUser.id) {
        contactsMap.set(message.sender.id, message.sender);
      }
      if (message.receiver.id !== currentUser.id) {
        contactsMap.set(message.receiver.id, message.receiver);
      }
    });

    return Array.from(contactsMap.values());
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.chatMessages = this.filterMessagesByUser(this.selectedUser);
  }

  filterMessagesByUser(user: User): Message[] {
    return this.messages.filter(
      (message) =>
        (message.sender.id === this.currentUser?.id &&
          message.receiver.id === user.id) ||
        (message.sender.id === user.id &&
          message.receiver.id === this.currentUser?.id)
    );
  }

  async sendMessage() {
    if (this.newMessageText.trim() && this.selectedUser) {
      const sentMessage = await this.messageService.sendMessage(
        this.currentUser!.id,
        this.selectedUser.id,
        this.newMessageText
      );
      this.messages.push(sentMessage); // Add the new message to the messages list
      this.chatMessages.push(sentMessage); // Add the new message to the filtered chat
      this.newMessageText = '';
    }
  }
}
