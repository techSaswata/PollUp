## QuickPolls — API

Simple polls API with MongoDB. Users can create polls, vote, and fetch results.

### Run locally

1) Install deps
```bash
npm install
```

2) Configure environment
Create a `.env` file in the project root:
```bash
PORT=3000
MONGODB_URI=YOUR_MONGODB_URI
```

3) Start server
```bash
npm run start
# or
npm run dev
```

Health check:
```bash
curl -s http://localhost:3000/
```

### Data Model

- Poll:
```
{ _id, userId?, question, options:[{ text, votes }], createdAt }
```
- Vote:
```
{ _id, pollId, userId?, optionIndex, createdAt }
```

### Endpoints

- POST `/polls` — Create a poll
  - Request:
  ```bash
  curl -s -H "Content-Type: application/json" \
    -d '{"question":"Which JS framework?","options":["React","Vue","Angular"]}' \
    http://localhost:3000/polls
  ```
  - Response:
  ```json
  { "id":"<pollId>", "question":"...", "options":[{"text":"React","votes":0}, ...], "createdAt":"..." }
  ```

- GET `/polls` — List polls
  - Request:
  ```bash
  curl -s http://localhost:3000/polls
  ```
  - Response:
  ```json
  [
    { "id":"<pollId>", "question":"...", "options":[{"text":"React","votes":1}, ...], "createdAt":"..." }
  ]
  ```

- POST `/polls/:id/vote` — Vote on an option
  - Request:
  ```bash
  curl -s -H "Content-Type: application/json" \
    -d '{"optionIndex":0}' \
    http://localhost:3000/polls/<pollId>/vote
  ```
  - Response (updated poll):
  ```json
  { "id":"<pollId>", "question":"...", "options":[{"text":"React","votes":2}, ...], "createdAt":"..." }
  ```

### Notes

- Votes are atomically incremented and also stored in a `Vote` collection.
- No auth is enforced; `userId` fields are optional and unused by default.

