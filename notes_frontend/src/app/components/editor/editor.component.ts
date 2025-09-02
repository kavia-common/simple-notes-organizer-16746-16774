import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnChanges {
  @Input() note?: Note | null;
  @Input() loading = false;

  @Output() change = new EventEmitter<Partial<Note>>();

  // Avoid referencing DOM types directly for lint in non-browser contexts
  @ViewChild('contentArea') contentArea?: ElementRef<any>;

  title = '';
  content = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note']) {
      this.title = this.note?.title || '';
      this.content = this.note?.content || '';
      const g: any = (typeof globalThis !== 'undefined') ? (globalThis as any) : {};
      const timerFn = g.setTimeout ? g.setTimeout.bind(g) : ((fn: () => void) => fn());
      timerFn(() => this.autoResize(), 0);
    }
  }

  // PUBLIC_INTERFACE
  /** Emits title/content change for parent to persist */
  onFieldChange() {
    this.change.emit({ title: this.title, content: this.content });
    this.autoResize();
  }

  private autoResize() {
    if (!this.contentArea?.nativeElement) return;
    const el: any = this.contentArea.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
}
