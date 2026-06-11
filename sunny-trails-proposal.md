## Sunny Trails Planner Proposal

### 1. Overview

Sunny Trails Planner is going to be a web app for planning trips to National Parks. Unfortunately, my wife and I have to use several different sites to check park info and weather, and it is a pain to keep switching back and forth. This is a common issue for people.

The idea with this project is pretty simple: I will be bringing different planning details into one place so it is easier to look at everything at once and make a decision. I also wanted to build something that is actually useful and not just a demo project.

### 2. Target Audience

My target audience is hikers, campers, road-trippers, and anyone else who enjoys outdoor recreation.

It is especially meant for people who want a one stop shop for planning with these details:

- Basic park info
- Weather and alerts
- A simple way to plan their trip and save the details

### 3. Major Functions

1. Search for National Parks by name and by state.
2. Show park details like description, location, images, and general visitor information.
3. Display weather data (temperature, wind, precipitation, forecast).
4. Show park alerts like closures or warnings.
5. Let users create a personalized itinerary.
6. Users can edit or delete saved trips.
7. Add notes and checklists for gear and other prep.
8. Save everything in local storage so it persists after refresh without an account.
9. Sort park results.
10. Show a quick summary of the trip before saving it.

### 4. Wireframes

I will make both mobile and desktop versions. Nothing too fancy, just enough to show layout.

Main screens:

- Home/search page (search bar + results)
- Park details page (info + weather + alerts + save option)
- Itinerary page (trip info, notes, checklist)

Mobile will be similar but will be stacked vertically.
Desktop will have sections next to each other so more is visible at once.

### 5. External Data

- National Park Service API
  - Park info, images, alerts, descriptions
- Open-Meteo API
  - Weather data (forecast, temp, wind, etc.)

Stored locally:

- Itinerary
- Notes and checklist items
- Selected parks

### 6. Module List

- parkService.js (handles parks service API calls)
- weatherService.js (weather API calls)
- storage.js (local storage)
- ui.js (renders the UI)
- events.js (clicks, inputs, etc.)
- utilities.js (misc functions)
- parkCard.js
- parkDetail.js
- itineraryForm.js
- itineraryList.js

### 7. Graphic Identity

Colors will be outdoors-themed, including mostly greens and earthy tones, with lighter backgrounds. Also some shades of blue for buttons or highlights.

The font will be something simple and readable like Roboto.

The style will be simple with just cards and spacing, but nothing too crowded.

Icon idea: Possibly a mountain or map pin.

### 8. Timeline

Week 5

- Finalize idea (if anything changes)
- Make wireframes
- Set up project files

Week 6

- Connect APIs
- Build search + park details
- Start itinerary + local storage

Week 7

- Finish checklist + notes
- Fix layout/responsiveness
- Testing and bug fixes (whatever breaks)
- Deploy

### 9. Project Planning

Trello board link: (add link here)

Basic task groups:

- Wireframes
- API setup
- UI
- Itinerary features
- Storage
- Testing
- Deployment

I will most likely add more tasks as I go.

### 10. Challenges

- Getting both APIs working and keeping things optimized
- Dealing with data formatting from the APIs
- Keeping the UI simple and not overbuilding it
- Mobile/small device compatibility
- Not trying to add too many features and running out of time
