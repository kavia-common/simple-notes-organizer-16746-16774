# Notes Frontend API Contract

The frontend expects a REST API available at `${environment.apiBaseUrl}/notes`.

Endpoints:
- GET /notes -> Note[]
- GET /notes/:id -> Note
- POST /notes -> Note (accepts { title, content })
- PUT /notes/:id -> Note (accepts { title?, content? })
- DELETE /notes/:id -> 204 No Content

Note JSON shape:
{
  "id": "string",
  "title": "string",
  "content": "string",
  "createdAt": "ISO-8601 string",
  "updatedAt": "ISO-8601 string"
}

Configuration:
- At runtime, you can inject a global `window.__NOTES_API_BASE_URL__` to override the base URL used by the frontend (default: /api).
