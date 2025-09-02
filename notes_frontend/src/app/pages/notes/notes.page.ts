import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { EditorComponent } from '../../components/editor/editor.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [
    NgIf,
    SidebarComponent,
    EditorComponent,
    ToolbarComponent,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './notes.page.html',
  styleUrl: './notes.page.css'
})
export class NotesPage implements OnInit, OnDestroy {
  private notesService = inject(NotesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  notes: Note[] = [];
  filteredNotes: Note[] = [];
  loading = false;
  saving = false;
  selected?: Note | null;
  searchQuery = '';

  private sub?: Subscription;

  ngOnInit(): void {
    // Load list and watch route params for selection
    this.refreshList().then(() => {
      this.sub = this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.selectById(id);
        } else {
          this.selected = undefined;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async refreshList() {
    this.loading = true;
    this.notesService.list().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applySearch() {
    this.filteredNotes = this.notesService.search(this.notes, this.searchQuery);
  }

  async selectById(id: string) {
    this.loading = true;
    this.notesService.get(id).subscribe({
      next: (note) => {
        this.selected = note;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSelect(note: Note) {
    if (note.id) {
      this.router.navigate(['/notes', note.id]);
    }
  }

  onSearchChange(q: string) {
    this.searchQuery = q;
    this.applySearch();
  }

  onCreate() {
    const temp: Note = { title: 'Untitled', content: '' };
    // Optimistically create via API then navigate
    this.saving = true;
    this.notesService.create({ title: temp.title, content: temp.content }).subscribe({
      next: (created) => {
        this.saving = false;
        this.notes.unshift(created);
        this.applySearch();
        if (created.id) {
          this.router.navigate(['/notes', created.id]);
        } else {
          this.selected = created;
        }
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  onSave() {
    if (!this.selected?.id) return;
    const { id, title, content } = this.selected;
    this.saving = true;
    this.notesService.update(id, { title, content }).subscribe({
      next: (updated) => {
        this.saving = false;
        // Update local list
        const idx = this.notes.findIndex(n => n.id === updated.id);
        if (idx >= 0) this.notes[idx] = updated;
        this.selected = updated;
        this.applySearch();
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  onDelete() {
    if (!this.selected?.id) return;
    const id = this.selected.id;
    this.saving = true;
    this.notesService.delete(id).subscribe({
      next: () => {
        this.saving = false;
        this.notes = this.notes.filter(n => n.id !== id);
        this.applySearch();
        this.selected = undefined;
        this.router.navigate(['/notes']);
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  onEditorChange(changes: Partial<Note>) {
    if (!this.selected) return;
    this.selected = { ...this.selected, ...changes };
  }
}
