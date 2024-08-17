import { rest, setupWorker } from "msw";

import * as households from "./households";

const handlers = [
  rest.post("/api/households", households.filter),
  rest.post("/api/households/new", households.create),
  rest.get("/api/households/:householdUid", households.read),
  rest.put("/api/households/:householdUid", households.update),
  rest.get("/api/households/:householdUid/members", households.readMembers),
  rest.post(
    "/api/households/:householdUid/members",
    households.createOrUpdateMembers
  ),
  rest.delete(
    "/api/households/:householdUid/members/:householdMemberUid",
    households.destroyMember
  ),
];

export const worker = setupWorker(...handlers);
