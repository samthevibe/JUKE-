# JUKE

JUKE is a music streaming service with separate charts for singles and albums.

## Features
- Album and single streams counted separately
- Weekly, monthly, and all-time charts
- Weighted album streams (12 streams = 1 album stream)

## Running Locally
```bash
npm install
npm start

---

### **3. Optional: Environment Variables (`.env`)**
- Later, if JUKE needs API keys or database credentials, create a `.env` file:  
- Remember to include `.env` in `.gitignore`.

---

### **4. Next Code Files**
If you want to **expand JUKE’s functionality**, the next files could be:  
- `routes.js` → define API routes for charts, streams, etc.  
- `controllers.js` → logic for calculating album/single streams  
- `data.json` → temporary storage for streams before adding a database  

---

If you want, I can **write the next JUKE file for you** — maybe a `routes.js` that handles `/albums` and `/singles` endpoints, ready to plug into your current `index.js`.  

Do you want me to do that?
