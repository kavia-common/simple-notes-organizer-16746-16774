import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  @Input() searchQuery = '';
  @Output() searchQueryChange = new EventEmitter<string>();

  @Output() create = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  // PUBLIC_INTERFACE
  /** Emit search change */
  onSearch(value: string) {
    this.searchQuery = value;
    this.searchQueryChange.emit(value);
  }
}
