# AGENTS.md — Project Context

## Who this is for

This project is built for **Matthew Geiling** (the repo owner) and him alone. It is a single-user, personal tool — no multi-tenant concerns, no public signups, no other audiences. Design and copy decisions should assume the reader is Matthew reviewing his own knowledge library.

## What this project is

A **personal knowledge management + active recall web app**. The goal is to move beyond passive note storage: Matthew wants to store, review, and *synthesize* information from the content he consumes (books, essays, articles, podcasts), using active learning techniques to actually retain it.

### Core features (planned)

**Library & Content Management**
1. Dashboard of all consumed content (books, essays, articles, podcasts)
2. Detail view per piece of content with metadata (author, publish date, date consumed)
3. View / add / edit personal notes attached to each piece of content

**Active Learning & Recall**
4. Flashcards — takeaways mixed in from various saved content
5. Active Recall Testing — quiz recall on a specific piece of content or a broader subject
6. Reflection Engine — surfaces a quote/point and provides a text editor to synthesize thoughts

**Advanced**
7. Knowledge Graph — visual map of how content connects via tags, themes, semantic links
8. Spaced Repetition (SRS) — Anki-style forgetting-curve scheduling in Flashcards & Recall
9. Serendipity Engine — resurfaces a random forgotten note or past reflection

## Current phase

**Frontend-only design exploration.** All data is hardcoded mock content so we can iterate on UI/UX. No backend yet.

## The gallery (`index.html`)

The repo root `index.html` is **not the app** — it is a version gallery for design iterations. Each design concept gets its own folder (`v01/`, `v02/`, … up to `v25/`), each containing its own standalone `index.html`. The gallery shows a grid of 25 slots with a live scaled-down preview thumbnail and a short note on what changed in that version.

**Workflow for adding a new version:**
1. Create `vNN/index.html` (self-contained design concept)
2. Open the root `index.html` and add an entry to the `VERSIONS` array at the top of the script: `{ id: 'vNN', note: 'short note on what changed' }`
3. Every version page must include a "← Gallery" link back to the root (`../index.html`)

## Tech stack (hard constraint — do not deviate)

- **Plain HTML and CSS, with optional vanilla JavaScript. Nothing else.**
- No frameworks (no React, Vue, Tailwind, etc.), no packages, no build step
- No external APIs and no data storage — all content is hardcoded mock data inline in each page
- Hosted in Matthew's own GitHub repo, deployed as static files on Vercel's free Hobby plan
- **If anyone (including an AI agent) suggests adding a framework or package, push back.**

## Conventions

- Each version page is fully self-contained (inline styles/scripts) so versions never break each other
- Mock data lives inline in each version page
