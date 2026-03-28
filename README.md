# FilmHub

A film-production management dashboard built with Django (Python 3.11) and React (Vite).

This is a simple React project built for Film makers to manage their film making with dynamic dashboard which connects all the departments within the company.
## Login Page
![Login Page](https://github.com/AravindEdakkot/cinehac_v2_0/raw/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_151329_localhost.jpeg)

This is an animated landing page for the Filmhub dashboard.

Director   → username: director   | password: dir123  
Producer   → username: producer   | password: pro123  
Manager    → username: manager    | password: man123  
Accountant → username: accountant | password: acc123  


---

## Director Dashboard
![Director Dashboard](https://github.com/AravindEdakkot/cinehac_v2_0/raw/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_15148_localhost.jpeg)

We can upload our movie script to generate a schedule for the movie.

![Calendar View](https://github.com/AravindEdakkot/cinehac_v2_0/raw/135934fc3e37583a0ad67ee9d871ab385fcd4dec/Screenshot_28-3-2026_15154_localhost.jpeg)

Allows tracking the film progress in calendar view (daily, weekly).

---

## Producer Dashboard
![Producer Dashboard](https://github.com/AravindEdakkot/cinehac_v2_0/raw/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_151533_localhost.jpeg)

Producer page allows setting the budget, viewing schedules (read-only), and provides a statistical dashboard for capital.

---

## Accountant Dashboard
![Accountant Dashboard](https://github.com/AravindEdakkot/cinehac_v2_0/raw/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_151640_localhost.jpeg)

Manages budget through expense logging, generates invoices, and exports logs to Excel and PDF.

---

## Production Manager Dashboard
![Production Manager](https://github.com/AravindEdakkot/cinehac_v2_0/raw/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_151816_localhost.jpeg)

Manages daily production, tracks equipment, and monitors post-production progress.

---


> [!NOTE]
> Update `.env` with your Google API key before running the project.

---
## Run Frontend

cd frontend

npm install

npm start


## Run node

cd Production-dashboard

npm install 

node -r dotenv/config server.js


