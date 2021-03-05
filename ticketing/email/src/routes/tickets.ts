import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
  currentUser,
} from "@ecomtest/tickets-common";
import { Ticket } from "../models/ticket";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

// custom: determines if user has a valid mongoId. Couples this route to other services. Can delete if planning on using other DBs
router.get("/api/email/tickets", async (req: Request, res: Response) => {
  // const tickets = await Ticket.build({
  //   title: "New ticket",
  //   price: 10,
  //   id: "12",
  // });

  res.send("Here are tickets supposed to be");
});

export { router as ticketsRouter };
