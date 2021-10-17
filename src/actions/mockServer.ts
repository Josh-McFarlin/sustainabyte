import {
  createServer,
  Model,
  Server,
  Factory,
  belongsTo,
  association,
} from "miragejs";
import faker from "faker";
import type { User } from "../types/User";
import type { Restaurant } from "../types/Restaurant";
import type { Review } from "../types/Review";

interface ServerArgs {
  environment: string;
}

const gtCoords = [33.7697031, -84.3947155];
const randomFoodUrl = "https://source.unsplash.com/collection/2311719";
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

export const makeServer = ({
  environment = "development",
}: ServerArgs): Server => {
  return createServer({
    environment,

    models: {
      user: Model,
      restaurant: Model,
      review: Model.extend({
        user: belongsTo("user"),
        restaurant: belongsTo("restaurant"),
      }),
    },
    seeds(server) {
      server.create("restaurant");
      server.create("user");
      server.create("review");
      server.createList("user", 10);
      server.createList("restaurant", 10);
      server.createList("review", 30);
    },
    factories: {
      user: Factory.extend<User>({
        id() {
          return faker.datatype.uuid();
        },
        name() {
          return faker.name.findName();
        },
        email() {
          return faker.internet.email();
        },
        username() {
          return faker.internet.userName();
        },
        avatarUrl(i) {
          const c = i % 2 ? "men" : "women";
          return `https://randomuser.me/api/portraits/${c}/${i}.jpg`;
        },
        score() {
          return faker.datatype.number(100);
        },
      }),
      restaurant: Factory.extend<Restaurant>({
        id() {
          return faker.datatype.uuid();
        },
        name() {
          return faker.company.companyName();
        },
        avatarUrl() {
          return `${randomFoodUrl}/100x100`;
        },
        description() {
          return faker.company.catchPhrase();
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
          const coords = faker.address
            .nearbyGPSCoordinate(gtCoords, 10)
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
      }),
      review: Factory.extend<Review>({
        id() {
          return faker.datatype.uuid();
        },
        // user() {
        //   return faker.datatype.uuid();
        // },
        // restaurant() {
        //   return faker.datatype.uuid();
        // },
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
          const count = faker.datatype.number(3) + 1;

          return [...foodTags].sort(() => 0.5 - Math.random()).slice(0, count);
        },
        photos() {
          const count = faker.datatype.number(3) + 1;

          return Array(count).fill(randomFoodUrl);
        },
        score() {
          return faker.datatype.number(100);
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
    },
  });
};
