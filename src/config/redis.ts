import { createClient } from "redis";

const client = createClient({
  username: "default",
  password: "Nrpmau2xB5MpFJ7uuWfBW44lmXKSqh4G",
  socket: {
    host: "redis-13631.c259.us-central1-2.gce.cloud.redislabs.com",
    port: 13631,
  },
});

export default client;
