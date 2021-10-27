import {
  association,
  belongsTo,
  createServer,
  Factory,
  hasMany,
  Model,
  RestSerializer,
  Server,
} from "miragejs";
import faker from "faker";
import dayjs from "dayjs";
import type { User } from "../types/User";
import type { Restaurant } from "../types/Restaurant";
import type { Review } from "../types/Review";
import type { Offer } from "../types/Offer";
import type { SocialGroup } from "../types/SocialGroup";
import type { CheckIn } from "../types/CheckIn";
import { randomSizeSubset, randomFoodUrl } from "./random";

interface ServerArgs {
  environment: string;
}

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

const getRandomDate = (hours = 24, minutes = 60): Date =>
  dayjs()
    .add(faker.datatype.number(hours), "hours")
    .add(faker.datatype.number(minutes), "minutes")
    .toDate();

const makeServer = ({ environment = "development" }: ServerArgs): Server => {
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
      server.createList("review", 20);
      server.createList("offer", 5);
      server.createList("socialGroup", 10).forEach((group) => {
        const count = faker.datatype.number(9) + 1;
        const subset = faker.datatype.number(4) + 1;

        group.update({
          members: server.createList("user", count, {
            groups: [group] as any,
          }) as any,
          reviews: server.schema
            .all("review")
            .models.sort(() => 0.5 - Math.random())
            .slice(0, subset) as any,
        });
      });

      const users = server.schema.all("user").models;
      const restaurants = server.schema.all("restaurant").models;

      restaurants.forEach((restaurant) => {
        const count = faker.datatype.number(15) + 1;

        for (let i = 0; i < count; i += 1) {
          server.create("checkIn", {
            restaurant,
            user: users.sort(() => 0.5 - Math.random())[0],
            createdAt: faker.date.recent(-2).valueOf(),
            withUsers: randomSizeSubset(users, 2, 0),
          });
        }
      });
    },
    serializers: {
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
      user: Factory.extend<User>({
        id() {
          return faker.datatype.uuid();
        },
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
      restaurant: Factory.extend<Restaurant>({
        id() {
          return faker.datatype.uuid();
        },
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
      review: Factory.extend<Review>({
        id() {
          return faker.datatype.uuid();
        },
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
      offer: Factory.extend<Offer>({
        id() {
          return faker.datatype.uuid();
        },
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
      socialGroup: Factory.extend<SocialGroup>({
        id() {
          return faker.datatype.uuid();
        },
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
      checkIn: Factory.extend<CheckIn>({
        id() {
          return faker.datatype.uuid();
        },
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

const runServer = (): void => {
  if ((window as any).server) {
    (window as any).server.shutdown();
  }

  (window as any).server = makeServer({ environment: "development" });
};

export default runServer;
