import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private events: any[] = [];

  // 🔴 THIS METHOD WAS MISSING
  createEvent(event: any) {
    this.events.push(event);
  }

  getEvents() {
    return this.events;
  }

  registerStudent(id: number) {
    const e = this.events.find(x => x.id === id);
    if (e) {
      e.registeredCount++;
    }
  }
}
