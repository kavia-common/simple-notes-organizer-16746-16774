import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Note } from '../models/note.model';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/notes`;

  // PUBLIC_INTERFACE
  /**
   * List all notes.
   * @returns Observable of Note[] ordered by updatedAt desc if provided.
   */
  list(): Observable<Note[]> {
    return this.http.get<Note[]>(this.baseUrl).pipe(
      map(notes => {
        return (notes || []).slice().sort((a, b) => {
          const aTime = a.updatedAt ? Date.parse(a.updatedAt) : (a.createdAt ? Date.parse(a.createdAt) : 0);
          const bTime = b.updatedAt ? Date.parse(b.updatedAt) : (b.createdAt ? Date.parse(b.createdAt) : 0);
          return bTime - aTime;
        });
      }),
      catchError(err => this.handleError('Failed to load notes', err, []))
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Get a single note by id.
   * @param id Note ID
   */
  get(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.baseUrl}/${encodeURIComponent(id)}`).pipe(
      catchError(err => this.handleError<Note>('Failed to load note', err))
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new note.
   * @param payload Note without id
   */
  create(payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Observable<Note> {
    return this.http.post<Note>(this.baseUrl, payload).pipe(
      catchError(err => this.handleError<Note>('Failed to create note', err))
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Update an existing note.
   * @param id Note ID
   * @param payload Partial fields to update
   */
  update(id: string, payload: Partial<Omit<Note, 'id'>>): Observable<Note> {
    return this.http.put<Note>(`${this.baseUrl}/${encodeURIComponent(id)}`, payload).pipe(
      catchError(err => this.handleError<Note>('Failed to update note', err))
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note by id.
   * @param id Note ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(id)}`).pipe(
      catchError(err => this.handleError<void>('Failed to delete note', err))
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Client-side search helper to filter notes by text in title or content.
   * When backend supports search, replace with GET /notes?query=...
   * @param notes List of notes
   * @param query Search query
   */
  search(notes: Note[], query: string): Note[] {
    const q = (query || '').trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q)
    );
  }

  private handleError<T>(message: string, error: HttpErrorResponse, fallback?: T): Observable<T> {
    console.error(message, error);
    if (typeof fallback !== 'undefined') {
      return of(fallback as T);
    }
    return throwError(() => new Error(message));
  }
}
