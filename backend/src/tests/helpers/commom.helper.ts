import { container } from "tsyringe";
import supertest from "supertest";
import { App } from "../../app";

export const app = container.resolve(App).getServer();
export const req = supertest(app);
