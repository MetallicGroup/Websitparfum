require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Because Turso driver needs initialization, we'll try standard initialization if the DB URL is standard,
// but since it's libsql, we need the adapter. Simply dynamically importing the client from Next.js works if tsx is used.
