# StudySpot

A lightweight social study app for spontaneous campus study sessions.

> Independent student project built around UC Davis campus life. Not affiliated with or endorsed by UC Davis.

## Problem
Students are surrounded by thousands of other students and still often study alone. Study plans tend to be last-minute ("I'm going to Shields for two hours, anyone want to come?"), the people you'd study with are scattered across group chats, Discords and clubs, and texting friends one by one takes more effort than the plan is worth.

## Solution
StudySpot lets students see who is studying around campus right now and join them. Hosts make themselves joinable instead of messaging people individually, and everyone else can just open the app, see what's happening, and show up.

## How it works
1. **See who's studying.** Browse the "Happening now" feed.
2. **Pick your vibe.** 🔒 Locked In, ☕ Casual, or 👋 Social.
3. **Show up.** Join a session, or start your own in a few taps.

## Features
- Live-style feed of study spots with course, host, location, start time, vibe, and participant count
- Start a Study Spot from a modal form with validation (optional host first name)
- Join a session (once per session), with "Joined ✓" feedback and updated counts
- Filter by vibe, plus a total "students studying right now" count calculated from the sessions
- Initial-based avatars, friendly empty state, small hover and confirmation animations
- Responsive layout; respects reduced-motion settings
- Data persists across refreshes with localStorage

## Tech stack
Next.js (App Router) · React · TypeScript · Tailwind CSS · localStorage

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
Deploys to Vercel with no extra configuration.

## Why I built it
I wanted to explore a small, specific social problem: how little it takes to turn "I'm heading to the library" into something other people can join. I kept the first version deliberately simple so I could focus on the core interaction.

## Current MVP limitations
- Data lives in your own browser's localStorage, so other people can't see the sessions you create
- The sessions in the feed are samples with made-up first names; there are no real users
- No authentication, accounts, backend or database
- No messaging, maps, GPS or notifications
- Sessions don't expire, and counts aren't verified

## Future ideas
- Accounts with university email sign-in and a shared database so sessions are visible to everyone
- Sessions that expire automatically when they end
- Study spot details, such as which floor or table to look for
- Optional notifications for courses you follow
- Moderation and reporting before any public launch

## Project map
- `app/page.tsx`: homepage, create/join logic, filters
- `components/`: `SessionCard`, `CreateForm`, `Modal`, and the story `Sections`
- `lib/sessions.ts`: types, vibes, locations, sample data
- `lib/useStudyState.ts`: localStorage persistence
