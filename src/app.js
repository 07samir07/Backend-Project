import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //JAB JSON SE DATA AATA HAI TO USKO PARSE KARNE KE LIYE

app.use(express.urlencoded({ extended: true, limit: "16kb" })); //JAB FORM/URL SE DATA AATA HAI TO USKO PARSE KARNE KE LIYE

app.use(express.static("public")); //STATIC FILES KO SERVE KARNE KE LIYE

app.use(cookieParser()); //COOKIES KO PARSE KARNE KE LIYE

export { app };
