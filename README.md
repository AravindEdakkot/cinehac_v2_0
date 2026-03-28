# filmhub

A film-production management dashboard built with Django (Python 3.11) and React (Vite).

This is a simple React project built for Film makers to manage their film making with dynamic dashboard which connects all the departments within the company.

## Login page
!(alt_image)[https://github.com/AravindEdakkot/cinehac_v2_0/raw/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_151329_localhost.jpeg]
This is a animated landing page for the Filmhub dashboard

##Director Dashboard
!(alt_image)[https://github.com/AravindEdakkot/cinehac_v2_0/blob/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_15148_localhost.jpeg]
We can upload out movie script to generate schedule for the movie.
!(alt_image)[https://github.com/AravindEdakkot/cinehac_v2_0/blob/135934fc3e37583a0ad67ee9d871ab385fcd4dec/Screenshot_28-3-2026_15154_localhost.jpeg]
allows tracking the film progress in calendar veiw, weekly view, daily view.

##Producer Dashboard
!(alt_image)[https://github.com/AravindEdakkot/cinehac_v2_0/blob/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_151533_localhost.jpeg]
Producer page allows the producer to set the budget for the movie and view schedules but cannot alter schedules and provides an statistical dashboard for capital.

##Accountant Dashboard
!(alt_image)[https://github.com/AravindEdakkot/cinehac_v2_0/blob/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_151640_localhost.jpeg]
Accountant page manage budget by proper logging of expences and generate invoices for services. Export the logs to excel and pdf.

##Production Manager Dashboard
!(alt_image)[https://github.com/AravindEdakkot/cinehac_v2_0/blob/450356bff76cd3164bda48f3489cdf0147edabff/Screenshot_28-3-2026_151816_localhost.jpeg]
Manages daily production, tracks equipments, view post production progress.
[!NOTE]
update .env with google api key

## run front end
cd frontend

npm install

npm start

## run node

cd Production-dashboard

npm install 

node -r dotenv/config server.js
