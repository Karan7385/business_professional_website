// IMPORT DEPENDENCIES
import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });
import cors from 'cors';
import axios from 'axios';
import countries from "world-countries";

// IMPORT ROUTES
import login_routes from './routes/auth/login_route.js';
import home_routes from './routes/home/home_routes.js';
import certificates_routes from './routes/certs/certificates_routes.js';
import products_routes from './routes/products/products_route.js';
import contact_routes from './routes/contact/contact_route.js';
import logs_routes from './routes/logs_routes.js';
import preference_routes from './routes/preference_routes.js';

// IMPORT DATABASE CONNECTION
import './config/db.js';

// INITIALIZE EXPRESS APP
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// ROUTES
app.use('/api/auth', login_routes);
app.use('/api/home', home_routes);
app.use('/api/certs', certificates_routes);
app.use('/api/products', products_routes);
app.use('/api/contact', contact_routes);
app.use('/api/logs', logs_routes);
app.use('/api/preferences', preference_routes);
app.get("/api/country-code", (req, res) => {
  try {
    // Since the data is local, we map over it synchronously without any network fetch
    const formattedCountries = countries.map((country) => {
      const root = country.idd?.root || "";
      const suffixes = country.idd?.suffixes || [""];
      const callingCode = suffixes.length === 1 ? `${root}${suffixes[0]}` : root;

      return {
        name: country.name?.common || "Unknown",
        code: country.cca2 || "",
        callingCode: callingCode // Outputs standard clean dial strings like "+91"
      };
    });

    // Sort alphabetically by country name
    formattedCountries.sort((a, b) => a.name.localeCompare(b.name));

    return res.json(formattedCountries);

  } catch (error) {
    console.error("Local processing error:", error.message);
    return res.status(500).json({ error: "Failed to load country codes" });
  }
});



// START THE SERVER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})