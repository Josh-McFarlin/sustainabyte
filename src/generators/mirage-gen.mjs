import {
  association,
  belongsTo,
  createServer,
  Factory,
  hasMany,
  Model,
  RestSerializer,
} from "miragejs";
import faker from "faker";
import dayjs from "dayjs";
import fs from 'fs';
import path from 'path'
import util from 'util'

faker.seed(100);
const dir = path.dirname(new URL(import.meta.url).pathname);

const gtCoords = [33.7697031, -84.3947155];
const foodTags = [
  "vegan",
  "vegetarian",
  "local",
  "yummy",
  "fancy",
  "boring",
  "delicious",
  "breakfast",
  "lunch",
  "dinner",
  "popular",
];

const getRandomDate = (hours = 24, minutes = 60) =>
  dayjs()
    .add(faker.datatype.number(hours), "hours")
    .add(faker.datatype.number(minutes), "minutes")
    .toDate();

const getRandomHours = () => {
  const open = faker.datatype.number(13) + 7;
  const close = faker.datatype.number(20 - open) + open;

  return {
    startHour: open,
    startMinute: Math.round(Math.random()) === 1 ? 30 : 0,
    endHour: close,
    endMinute: Math.round(Math.random()) === 1 ? 30 : 0,
  };
};

const randomSubset = (arr, count) =>
[...arr].sort(() => 0.5 - Math.random()).slice(0, count);

const randomSizeSubset = (arr, max, min = 1) => {
  const count = faker.datatype.number(max - min) + min;

  return randomSubset(arr, count);
};

const randomFoodUrl = "https://source.unsplash.com/collection/2311719";

const makeServer = ({ environment = "development" }) => {
  return createServer({
    environment,
    models: {
      user: Model.extend({
        groups: hasMany("socialGroup"),
      }),
      restaurant: Model,
      review: Model.extend({
        user: belongsTo(),
        restaurant: belongsTo(),
      }),
      offer: Model.extend({
        restaurant: belongsTo(),
      }),
      socialGroup: Model.extend({
        members: hasMany("user"),
        reviews: hasMany("review"),
      }),
      checkIn: Model.extend({
        user: belongsTo(),
        restaurant: belongsTo(),
        withUsers: hasMany("user"),
      }),
    },
    seeds(server) {
      // server.createList("user", 10);
      server.createList("review", 6);
      server.createList("offer", 3);

      const users = server.schema.all("user").models;

      server.createList("socialGroup", 5).forEach((group) => {
        const memberCount = faker.datatype.number(4) + 1;
        const reviewCount = faker.datatype.number(3) + 1;

        const members = users.sort(() => 0.5 - Math.random()).slice(0, memberCount)

        group.update({
          members,
          reviews: server.schema
            .all("review")
            .models.sort(() => 0.5 - Math.random())
            .slice(0, reviewCount),
        });

        members.forEach((member) => {
          member.update({
            groups: [...member.groups.models, group]
          })
        })
      });

      const restaurants = server.schema.all("restaurant").models;

      restaurants.forEach((restaurant) => {
        const count = faker.datatype.number(6) + 1;

        for (let i = 0; i < count; i += 1) {
          server.create("checkIn", {
            restaurant,
            user: users.sort(() => 0.5 - Math.random())[0],
            createdAt: faker.date.recent(-2).valueOf(),
            withUsers: randomSizeSubset(users, 2, 0),
          });
        }
      });

      let o = server.db.dump();
      o.users.forEach(user => user.groupIds = [...new Set(user.groupIds)])
      // fs.writeFileSync(dir + "/schema.json.js", JSON.stringify(o, null, 2))
      fs.writeFileSync(dir + "/mirage-json.ts", "export default " + util.inspect(o, {compact: false, showHidden: false, depth: null, maxArrayLength: null, maxStringLength: null}), 'utf-8')
    },
    serializers: {
      user: RestSerializer.extend({
        include: ["groups"],
        embed: false,
      }),
      review: RestSerializer.extend({
        include: ["user", "restaurant"],
        embed: false,
      }),
      offer: RestSerializer.extend({
        include: ["restaurant"],
        embed: false,
      }),
      socialGroup: RestSerializer.extend({
        include: ["members", "reviews"],
        embed: false,
      }),
      checkIn: RestSerializer.extend({
        include: ["user", "restaurant", "withUsers"],
        embed: false,
      }),
    },
    factories: {
      user: Factory.extend({
        name(i) {
          const gender = i % 2 ? 0 : 1;

          return `${faker.name.firstName(gender)} ${faker.name.lastName(
            gender
          )}`;
        },
        email() {
          return faker.internet.email();
        },
        username() {
          return faker.internet.userName(...this.name.split(" "));
        },
        avatarUrl(i) {
          const gender = i % 2 ? "men" : "women";

          return `https://randomuser.me/api/portraits/${gender}/${i}.jpg`;
        },
        score() {
          return faker.datatype.number(100);
        },
        locations() {
          return [];
        },
        groups() {
          return [];
        },
      }),
      restaurant: Factory.extend({
        name() {
          return faker.company.companyName();
        },
        avatarUrl(i) {
          return `${randomFoodUrl}/100x100?sig=${i}`;
        },
        headerUrl(i) {
          return `${randomFoodUrl}/1080x1080?sig=${i}`;
        },
        description() {
          return faker.company.catchPhrase();
        },
        tags() {
          return randomSizeSubset(foodTags, 4);
        },
        openHours() {
          // const hours = getRandomHours();
          //
          // return [
          //   [hours],
          //   [hours],
          //   [hours],
          //   [hours],
          //   [hours],
          //   [hours],
          //   [hours],
          // ];

          return []
        },
        address() {
          const state = faker.address.state(true);

          return {
            street: faker.address.streetAddress(),
            city: faker.address.city(),
            state,
            country: faker.address.country(),
            zipCode: parseInt(faker.address.zipCodeByState(state), 10),
          };
        },
        coordinates() {
          const randRadius = faker.datatype.number(9) + 1;
          const coords = faker.address
            .nearbyGPSCoordinate(gtCoords, randRadius)
            .map(parseFloat);

          return {
            latitude: coords[0],
            longitude: coords[1],
          };
        },
        website() {
          return faker.internet.url();
        },
        phoneNumber() {
          return faker.phone.phoneNumber();
        },
        ratings() {
          const count = faker.datatype.number(990) + 10;
          const avg = faker.datatype.number(4) + 1;

          return {
            sum: count * avg,
            count,
          };
        },
        sustainability() {
          const vegan = faker.datatype.number(100);
          const vegetarian = faker.datatype.number(100 - vegan) + vegan;

          return {
            vegan,
            vegetarian,
          };
        },
      }),
      review: Factory.extend({
        user: association(),
        restaurant: association(),
        createdAt() {
          return faker.date.recent().valueOf();
        },
        stars() {
          return faker.datatype.number(4) + 1;
        },
        body() {
          return faker.lorem.sentences(3);
        },
        tags() {
          return randomSizeSubset(foodTags, 4);
        },
        photos(index) {
          const count = faker.datatype.number(3) + 1;

          return Array.from(Array(count)).map(
            (_, index2) => `${randomFoodUrl}/1080x1080?sig=${index}${index2}`
          );
        },
        score() {
          return faker.datatype.number(100);
        },
      }),
      offer: Factory.extend({
        restaurant: association(),
        createdAt() {
          return faker.date.recent().valueOf();
        },
        expiresAt() {
          return getRandomDate().valueOf();
        },
        photo(index) {
          return `${randomFoodUrl}/1080x1080?sig=${index}`;
        },
        title() {
          return faker.lorem.words(3);
        },
        body() {
          return faker.lorem.words(6);
        },
        prompt() {
          return "Order Now";
        },
      }),
      socialGroup: Factory.extend({
        createdAt() {
          return faker.date.recent().valueOf();
        },
        name() {
          return faker.lorem.words(3);
        },
        description() {
          return faker.lorem.words(6);
        },
        icon(i) {
          return `${randomFoodUrl}/1080x1080?sig=${i}`;
        },
        members() {
          return [];
        },
        reviews() {
          return [];
        },
      }),
      checkIn: Factory.extend({
        user: association(),
        restaurant: association(),
        createdAt() {
          return faker.date.recent().valueOf();
        },
        withUsers() {
          return [];
        },
      }),
    },
    routes() {
      this.namespace = "api";

      this.get("/user");
      this.get("/user/:id");
      this.post("/user");
      this.patch("/user/:id");
      this.del("/user/:id");

      this.get("/restaurant");
      this.get("/restaurant/:id");
      this.post("/restaurant");
      this.patch("/restaurant/:id");
      this.del("/restaurant/:id");

      this.get("/review");
      this.get("/review/:id");
      this.post("/review");
      this.patch("/review/:id");
      this.del("/review/:id");

      this.get("/offer");
      this.get("/offer/:id");
      this.post("/offer");
      this.patch("/offer/:id");
      this.del("/offer/:id");

      this.get("/socialGroup");
      this.get("/socialGroup/:id");
      this.post("/socialGroup");
      this.patch("/socialGroup/:id");
      this.del("/socialGroup/:id");

      this.get("/checkIn");
      this.get("/checkIn/:id");
      this.post("/checkIn");
      this.patch("/checkIn/:id");
      this.del("/checkIn/:id");
    },
  });
};

makeServer({ environment: "development" });
