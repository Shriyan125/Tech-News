## Tech News Hub

Tech News Hub is a simple web app that shows you the latest technology news pulled from NewsAPI. You can search for topics you care about, sort articles, and save the ones you like — all in a clean interface that works on both desktop and mobile.
Live site: https://ubiquitous-brigadeiros-4ce31d.netlify.app/

## What it does

Fetches up to 100 live tech news articles on load
Search articles by keyword (like "AI", "Apple", "cybersecurity")
Sort by newest, oldest, or alphabetically
Like or favourite articles and filter by them later
Toggle between dark and light mode
Shows a loading state while fetching, and a proper error message if something goes wrong


## Features

*** Article Cards ***
Each article is displayed as a card showing the headline, source name, a short description, the publication date, and a thumbnail image. If an image is not available, a placeholder is shown instead. Every card has a "Read More" button that opens the full article in a new tab.
*** Search ***
The search bar filters articles in real time as you type. It matches your query against the article title, description, and source name, so you don't have to be exact.
*** Sort ***
You can sort the current list of articles four ways — newest first, oldest first, A to Z, or Z to A — without making a new API call.
*** Like and Favourite ***
Each card has a like button and a favourite button. Once you mark articles, you can switch to the Liked or Favourited filter tab to see only those. The stats bar at the top always shows you how many you have liked and favourited.
*** Stats Bar ***
A small bar just above the article grid tells you how many articles are currently visible, how many were fetched in total, and your current like and favourite counts.
*** Dark Mode ***
A toggle in the top right switches between light and dark themes. The transition is smooth and applies across every part of the page.
*** Responsive Layout ***
On desktop, articles are displayed in a multi-column grid. On mobile, they stack into a single column and the controls rearrange themselves to stay usable.


## Fixing the CORS Error (426)
NewsAPI blocks direct requests from the browser in production due to CORS restrictions, which was showing up as an Error 426. To fix this, I used AI to help build a lightweight proxy server that sits between the frontend and the NewsAPI. The frontend makes requests to the proxy, the proxy calls NewsAPI on the server side, and the response is passed back — so the API key stays hidden and the CORS issue goes away entirely.

## Project Structure
tech-news-hub/
├── index.html      # The page layout
├── style.css       # All the styling and theming
├── script.js       # Fetching, rendering, search, sort, filter
└── README.md       # You're reading it

## Built With
HTML, CSS, and JavaScript — no frameworks
NewsAPI for the live news data
A custom proxy server to handle CORS in production (With the help of AI)
