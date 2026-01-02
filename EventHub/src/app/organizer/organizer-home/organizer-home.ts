import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-organizer-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './organizer-home.html',
  styleUrls: ['./organizer-home.css']
})
export class OrganizerHome {
  organizerName = 'Organizer';
}
