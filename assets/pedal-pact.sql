CREATE TABLE "user" (
  "user_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "first_name" text NOT NULL DEFAULT (NO_FIRST_NAME),
  "last_name" text NOT NULL DEFAULT (NO_LAST_NAME),
  "email" text UNIQUE NOT NULL,
  "email_verified" timestamp(6),
  "image" text,
  "password" text,
  "location_id" int,
  "role" text NOT NULL DEFAULT 'USER',
  "created_at" timestamp(6) DEFAULT (now()),
  "updated_at" timestamp(6) DEFAULT (now())
);

CREATE TABLE "location" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "city" text NOT NULL,
  "state_id" int NOT NULL
);

CREATE TABLE "state" (
  "state_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "abbreviation" text UNIQUE NOT NULL,
  "name" text NOT NULL
);

CREATE TABLE "ride" (
  "ride_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "slug" text NOT NULL,
  "date" timestamp(6) NOT NULL,
  "path" text NOT NULL,
  "elevation" text NOT NULL,
  "distance" decimal(5,2) NOT NULL,
  "short_description" text NOT NULL,
  "long_description" text NOT NULL,
  "static_map_url" text,
  "location_id" int NOT NULL,
  "created_at" timestamp(6) DEFAULT (now()),
  "updated_at" timestamp(6) DEFAULT 'now()'
);

CREATE TABLE "user_ride" (
  "user_ride_id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "ride_id" uuid NOT NULL,
  "status" text NOT NULL DEFAULT (SIGNED_UP),
  "date_signed_up" timestamp(6) NOT NULL DEFAULT (now()),
  "date_completed" timestamp(6)
);

CREATE TABLE "Account" (
  "userId" uuid NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" int,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  "createdAt" timestamp(6) NOT NULL DEFAULT 'now()',
  "updatedAt" timestamp(6) NOT NULL DEFAULT 'now()',
  PRIMARY KEY ("provider", "providerAccountId")
);

CREATE TABLE "Session" (
  "sessionToken" text PRIMARY KEY,
  "userId" uuid NOT NULL,
  "expires" timestamp(6) NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL
);

CREATE TABLE "VerificationToken" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp(6) NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

CREATE TABLE "PasswordResetToken" (
  "id" uuid PRIMARY KEY,
  "token" text UNIQUE NOT NULL,
  "userId" uuid NOT NULL,
  "expires" timestamp NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT (now())
);

ALTER TABLE "user" ADD FOREIGN KEY ("location_id") REFERENCES "location" ("id");

ALTER TABLE "location" ADD FOREIGN KEY ("state_id") REFERENCES "state" ("state_id");

ALTER TABLE "ride" ADD FOREIGN KEY ("location_id") REFERENCES "location" ("id");

ALTER TABLE "user_ride" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("user_id");

ALTER TABLE "user_ride" ADD FOREIGN KEY ("ride_id") REFERENCES "ride" ("ride_id");

ALTER TABLE "Account" ADD FOREIGN KEY ("userId") REFERENCES "user" ("user_id");

ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "user" ("user_id");
