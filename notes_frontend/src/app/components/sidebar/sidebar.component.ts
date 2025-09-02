import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../../models/note.model';
import { NgFor, NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() notes: Note[] = [];
  @Input() selectedId?: string;
  @Input() loading = false;
  @Input() searchQuery = '';

  @Output() select = new EventEmitter<Note>();

  // PUBLIC_INTERFACE
  /** Emits selected note */
  onSelect(note: Note) {
    this.select.emit(note);
  }

  trackById(_index: number, item: Note) {
    return item.id || item.title + item.createdAt;
  }
}
