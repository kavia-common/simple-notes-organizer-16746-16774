# Simple Notes Frontend (Angular)

Modern, minimalistic, light-themed UI for a simple notes organizer.

- Features: Create, Edit, Delete, View list, Search notes
- Layout: Toolbar (quick actions) + Sidebar (notes list) + Main Editor
- Palette: primary `#1976d2`, secondary `#424242`, accent `#ffca28`

## Run locally

```bash
npm install
npm start
# open http://localhost:3000
```

The app expects a backend REST API (see API_CONTRACT.md). You can override the API base url at runtime:
```html
<script>window.__NOTES_API_BASE_URL__ = 'http://localhost:8080';</script>
```

## Build

```bash
npm run build
```

## Structure
- app/components: toolbar, sidebar, editor
- app/pages/notes: page composing the layout and wiring actions
- app/services/notes.service.ts: REST API calls
- app/models/note.model.ts: Note interface

## Notes
- All @angular/* package versions are aligned to avoid build issues.
- The UI performs client-side search; replace with server search if available.
- See API_CONTRACT.md for expected endpoints.
