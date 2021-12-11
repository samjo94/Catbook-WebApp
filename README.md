För att använda programmet gör du följande:

- Hämta ned hela Git-repot eller mappen "Project"

- Öppna en terminal och ställ dig i Project/backend, skriv kommandot
	"npm install"
  följt av
	"node app.js" 

- Öppna en ny terminal och ställ dig i Project/frontend, skriv kommandot
	"npm install"
  följt av
	"npm start"

Hemsidan ska nu öppnas och låta dig använda all funktionalitet. För att se innehållet i databasen kan du öppna "http://localhost:5000/getall" i webbläsaren. För att ta bort allt som är sparat, öppna "http://localhost:5000/deleteall" på samma sätt.



För att köra tester behöver servern vara igång. Följ steget ovan för att starta servern med "node app.js"-kommandot. 

Backend:

- Öppna en ny terminal och navigera till Project/backend/test, kör sedan kommandot
	"npm test"

Resultatet av körningen visas i terminalen.

Frontend:

- Öppna en ny terminal och navigera till Project/frontend/test, kör sedan kommandot
	"python3 test.py"