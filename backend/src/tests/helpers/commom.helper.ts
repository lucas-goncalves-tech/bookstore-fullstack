import { container } from "tsyringe";
import supertest, { agent } from "supertest";
import { App } from "../../app";

export const app = container.resolve(App).getServer();
export const req = supertest(app);
export const reqAgent = agent(app);
