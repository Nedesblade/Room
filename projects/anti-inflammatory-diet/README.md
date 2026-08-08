# anti-inflammatory-diet

A little diet app, hosted in [the room](https://nedesblade.github.io/Room/) on the sideboard:
<https://nedesblade.github.io/Room/projects/anti-inflammatory-diet/>

- **Today** — daily habit checklist with a progress ring and streak (saved in your browser only)
- **Food guide** — searchable eat-freely / easy-does-it / keep-rare lists
- **Meal ideas** — a plate for the day, steady until you shuffle it

## Editing the content

Everything the app shows lives in [`data.json`](data.json) — habits, foods, meals.
Edit that file right here on GitHub (pencil icon), commit to `main`, and the
published page updates itself about a minute later. No code changes needed.

The app itself is a single `index.html`; pushes to `main` republish it into the
room automatically via `.github/workflows/publish-to-room.yml`.
