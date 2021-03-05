import express from "express";
import "express-async-errors"; //allows synchronous error handling middleware to be called from inside an asynchronous method with throw keyword
import { json } from "body-parser";
import cookieSession from "cookie-session";

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@ecomtest/tickets-common";

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

const app = express();

// the ingress controller acts as a proxy; this makes it trusted
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test' -- for when https is added
    secure: false,
  })
);

// middleware that sets the users cookie if they are authenticated
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
