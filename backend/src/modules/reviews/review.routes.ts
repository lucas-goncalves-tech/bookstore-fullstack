import "./review.doc";

import { Router } from "express";
import { injectable } from "tsyringe";

@injectable()
export class ReviewsRoutes {
  private readonly router = Router();

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes() {
    // Currently no endpoints remaining; reserved for future admin scoping
  }

  get routes() {
    return this.router;
  }
}
