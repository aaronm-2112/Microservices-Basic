import express, { Request, Response } from "express";

import { currentUser } from "@ecomtest/tickets-common";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    // return the current user if not undefined else return null
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
