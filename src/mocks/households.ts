import { faker } from "@faker-js/faker";
import { faker as fakerJp } from "@faker-js/faker/locale/ja";
import {
  DefaultBodyType,
  PathParams,
  ResponseComposition,
  RestContext,
  RestRequest,
} from "msw";

const relationshipItems = [
  "本人",
  "配偶者",
  "子",
  "父",
  "母",
  "兄",
  "弟",
  "姉",
  "妹",
  "義父",
  "義母",
  "義兄",
  "義弟",
  "義姉",
  "義妹",
  "孫",
  "ひ孫",
  "おじ",
  "おば",
  "いとこ",
  "祖父",
  "祖母",
  "曽祖父",
  "曽祖母",
  "姪",
  "甥",
  "その他",
] as const;

type RelationShip = (typeof relationshipItems)[number];

const generateUid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4()}-${s4()}-${s4()}-${s4()}`;
};

const householdEntities = Array.from({ length: 100 }).map(() => {
  const date = fakerJp.date.past();
  return {
    uid: generateUid(),
    name: `${fakerJp.person.lastName()} ${fakerJp.person.firstName()}`,
    postalCode: fakerJp.location.zipCode().replaceAll("-", ""),
    address: fakerJp.location.streetAddress(),
    phoneNumber: fakerJp.phone.number().replaceAll("-", ""),
    email: faker.internet.email(),
    created: date.toISOString(),
    updated: new Date(date.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  };
});

export const filter = async (
  req: RestRequest<never, PathParams<string>>,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext
) => {
  const body = await req.json();
  const limit = Number(body.limit ?? undefined);
  const offset = Number(body.offset ?? 0);
  const search = body.search ?? "";

  if (isNaN(limit)) {
    return res(ctx.status(422), ctx.json({ message: "limit is not number" }));
  }
  if (isNaN(offset)) {
    return res(ctx.status(422), ctx.json({ message: "offset is not number" }));
  }
  if (limit < 1) {
    return res(ctx.status(422), ctx.json({ message: "limit is less than 1" }));
  }
  if (offset < 0) {
    return res(ctx.status(422), ctx.json({ message: "offset is less than 0" }));
  }

  const households = householdEntities.filter(
    (household) =>
      household.email.includes(search) || household.phoneNumber.includes(search)
  );

  return res(
    ctx.status(200),
    ctx.json({
      count: households.length,
      households: households.slice(offset, offset + limit),
    })
  );
};

export const create = async (
  req: RestRequest<never, PathParams<string>>,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext
) => {
  const { zipCode, address, phoneNumber, email } = await req.json();
  const today = new Date();
  return res(
    ctx.status(200),
    ctx.json({
      uid: generateUid(),
      zipCode,
      address,
      phoneNumber,
      email,
      created: today.toISOString(),
      updated: today.toISOString(),
    })
  );
};

export const read = (
  req: RestRequest<never, PathParams<string>>,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext
) => {
  const { householdUid } = req.params;
  const date = fakerJp.date.past();
  return res(
    ctx.status(200),
    ctx.json({
      uid: householdUid,
      zipCode: fakerJp.location.zipCode().replaceAll("-", ""),
      address: fakerJp.location.streetAddress(),
      phoneNumber: fakerJp.phone.number().replaceAll("-", ""),
      email: faker.internet.email(),
      created: date.toISOString(),
      updated: new Date(
        date.getTime() + 1000 * 60 * 60 * 24 * 30
      ).toISOString(),
    })
  );
};

export const update = async (
  req: RestRequest<never, PathParams<string>>,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext
) => {
  const { householdUid } = req.params;
  const { zipCode, address, phoneNumber, email } = await req.json();
  const created = fakerJp.date.past();
  const updated = new Date();
  return res(
    ctx.status(200),
    ctx.json({
      uid: householdUid,
      zipCode,
      address,
      phoneNumber,
      email,
      created: created.toISOString(),
      updated: updated.toISOString(),
    })
  );
};

export const readMembers = (
  req: RestRequest<never, PathParams<string>>,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext
) => {
  const { householdUid } = req.params;
  const date = fakerJp.date.past();
  const createMember = (relationship?: RelationShip) => {
    const birthday = {
      year: fakerJp.date.past().getFullYear(),
      month: (fakerJp.date.past().getMonth() + 1).toString().padStart(2, "0"),
      date: fakerJp.date.past().getDate().toString().padStart(2, "0"),
    };
    return {
      uid: generateUid(),
      householdUid,
      familyName: fakerJp.person.lastName(),
      givenName: fakerJp.person.firstName(),
      birthday: `${birthday.year}-${birthday.month}-${birthday.date}`,
      relationship:
        relationship ??
        relationshipItems[Math.floor(Math.random() * relationshipItems.length)],
      created: date.toISOString(),
      updated: new Date(
        date.getTime() + 1000 * 60 * 60 * 24 * 30
      ).toISOString(),
    };
  };
  const memberCount = Math.floor(Math.random() * 10) + 1;
  const members = [
    createMember("本人"),
    ...Array.from({ length: memberCount - 1 }).map(() => createMember()),
  ];
  return res(ctx.status(200), ctx.json(members));
};

export const createOrUpdateMembers = async (
  req: RestRequest<never, PathParams<string>>,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext
) => {
  const today = new Date().toISOString();
  const members = (await req.json())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((member: any) => {
      if (member.uid) {
        return {
          ...member,
          updated: today,
        };
      }
      return {
        ...member,
        uid: generateUid(),
        created: today,
        updated: today,
      };
    });
  return res(ctx.status(200), ctx.json(members));
};

export const destroyMember = (
  req: RestRequest<never, PathParams<string>>,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext
) => {
  const { householdUid, householdMemberUid } = req.params;
  return res(ctx.status(200), ctx.json({ householdUid, householdMemberUid }));
};
