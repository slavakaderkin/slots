CREATE TABLE "Account" (
  "accountId" bigint generated always as identity,
  "phone" varchar NULL,
  "tg" bigint NULL,
  "info" jsonb NULL,
  "registered" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeen" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isBanned" boolean NOT NULL DEFAULT false,
  "timezone" varchar NULL
);

ALTER TABLE "Account" ADD CONSTRAINT "pkAccount" PRIMARY KEY ("accountId");

CREATE TABLE "Profile" (
  "profileId" bigint generated always as identity,
  "accountId" bigint NOT NULL,
  "name" varchar NOT NULL,
  "description" text NOT NULL,
  "city" varchar NULL,
  "address" varchar NULL,
  "termLink" varchar NULL,
  "isActive" boolean NOT NULL,
  "category" varchar NOT NULL,
  "specialization" varchar NULL,
  "balance" bigint NOT NULL DEFAULT '0',
  "slotDuration" integer NOT NULL DEFAULT 60
);

ALTER TABLE "Profile" ADD CONSTRAINT "pkProfile" PRIMARY KEY ("profileId");
ALTER TABLE "Profile" ADD CONSTRAINT "fkProfileAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId");

CREATE TABLE "Client" (
  "clientId" bigint generated always as identity,
  "accountId" bigint NOT NULL,
  "profileId" bigint NOT NULL,
  "isBanned" boolean NOT NULL DEFAULT false
);

ALTER TABLE "Client" ADD CONSTRAINT "pkClient" PRIMARY KEY ("clientId");
ALTER TABLE "Client" ADD CONSTRAINT "fkClientAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId");
ALTER TABLE "Client" ADD CONSTRAINT "fkClientProfile" FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId");

CREATE TABLE "Slot" (
  "slotId" bigint generated always as identity,
  "datetime" timestamp with time zone NOT NULL,
  "profileId" bigint NOT NULL,
  "isAvailable" boolean NOT NULL DEFAULT true,
  "isBlocked" boolean NOT NULL DEFAULT false
);

ALTER TABLE "Slot" ADD CONSTRAINT "pkSlot" PRIMARY KEY ("slotId");
ALTER TABLE "Slot" ADD CONSTRAINT "fkSlotProfile" FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId");

CREATE TABLE "Service" (
  "serviceId" bigint generated always as identity,
  "profileId" bigint NOT NULL,
  "name" varchar NOT NULL,
  "description" text NULL,
  "price" bigint NOT NULL,
  "isOnline" boolean NOT NULL DEFAULT false,
  "allDay" boolean NOT NULL DEFAULT false,
  "isVisits" boolean NOT NULL DEFAULT false,
  "autoConfirm" boolean NOT NULL DEFAULT true,
  "state" varchar NOT NULL DEFAULT 'active',
  "duration" integer NULL DEFAULT 60
);

ALTER TABLE "Service" ADD CONSTRAINT "pkService" PRIMARY KEY ("serviceId");
ALTER TABLE "Service" ADD CONSTRAINT "fkServiceProfile" FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId");

CREATE TABLE "Booking" (
  "bookingId" bigint generated always as identity,
  "profileId" bigint NOT NULL,
  "clientId" bigint NOT NULL,
  "slotId" bigint NOT NULL,
  "datetime" timestamp with time zone NOT NULL,
  "serviceId" bigint NOT NULL,
  "duration" integer NULL,
  "allDay" boolean NOT NULL DEFAULT false,
  "isPaid" boolean NOT NULL DEFAULT false,
  "state" varchar NOT NULL DEFAULT 'pending',
  "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "comment" text NULL
);

ALTER TABLE "Booking" ADD CONSTRAINT "pkBooking" PRIMARY KEY ("bookingId");
ALTER TABLE "Booking" ADD CONSTRAINT "fkBookingProfile" FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId");
ALTER TABLE "Booking" ADD CONSTRAINT "fkBookingClient" FOREIGN KEY ("clientId") REFERENCES "Client" ("clientId");
ALTER TABLE "Booking" ADD CONSTRAINT "fkBookingSlot" FOREIGN KEY ("slotId") REFERENCES "Slot" ("slotId");
ALTER TABLE "Booking" ADD CONSTRAINT "fkBookingService" FOREIGN KEY ("serviceId") REFERENCES "Service" ("serviceId");

CREATE TABLE "Category" (
  "categoryId" bigint generated always as identity,
  "name" varchar NOT NULL,
  "parentId" bigint NULL
);

ALTER TABLE "Category" ADD CONSTRAINT "pkCategory" PRIMARY KEY ("categoryId");
ALTER TABLE "Category" ADD CONSTRAINT "fkCategoryParent" FOREIGN KEY ("parentId") REFERENCES "Category" ("categoryId");

CREATE TABLE "Employee" (
  "employeeId" bigint generated always as identity,
  "profileId" bigint NOT NULL,
  "accountId" bigint NOT NULL,
  "state" varchar NOT NULL
);

ALTER TABLE "Employee" ADD CONSTRAINT "pkEmployee" PRIMARY KEY ("employeeId");
ALTER TABLE "Employee" ADD CONSTRAINT "fkEmployeeProfile" FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId");
ALTER TABLE "Employee" ADD CONSTRAINT "fkEmployeeAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId");

CREATE TABLE "Feedback" (
  "feedbackId" bigint generated always as identity,
  "profileId" bigint NOT NULL,
  "accountId" bigint NOT NULL,
  "serviceId" bigint NULL,
  "employeeId" bigint NULL,
  "bookingId" bigint NOT NULL,
  "isAnonymous" boolean NOT NULL DEFAULT false,
  "rating" integer NOT NULL DEFAULT 5,
  "text" text NULL,
  "date" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Feedback" ADD CONSTRAINT "pkFeedback" PRIMARY KEY ("feedbackId");
ALTER TABLE "Feedback" ADD CONSTRAINT "fkFeedbackProfile" FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId");
ALTER TABLE "Feedback" ADD CONSTRAINT "fkFeedbackAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId");
ALTER TABLE "Feedback" ADD CONSTRAINT "fkFeedbackService" FOREIGN KEY ("serviceId") REFERENCES "Service" ("serviceId");
ALTER TABLE "Feedback" ADD CONSTRAINT "fkFeedbackEmployee" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("employeeId");
ALTER TABLE "Feedback" ADD CONSTRAINT "fkFeedbackBooking" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("bookingId");

CREATE TABLE "PaymentProvider" (
  "paymentProviderId" bigint generated always as identity,
  "name" varchar NOT NULL,
  "token" varchar NOT NULL,
  "profileId" bigint NOT NULL
);

ALTER TABLE "PaymentProvider" ADD CONSTRAINT "pkPaymentProvider" PRIMARY KEY ("paymentProviderId");
ALTER TABLE "PaymentProvider" ADD CONSTRAINT "fkPaymentProviderProfile" FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId");

CREATE TABLE "Session" (
  "sessionId" bigint generated always as identity,
  "token" varchar NOT NULL,
  "accountId" bigint NOT NULL,
  "ip" inet NOT NULL,
  "data" jsonb NOT NULL
);

ALTER TABLE "Session" ADD CONSTRAINT "pkSession" PRIMARY KEY ("sessionId");
CREATE UNIQUE INDEX "akSessionToken" ON "Session" ("token");
ALTER TABLE "Session" ADD CONSTRAINT "fkSessionAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId");

CREATE TABLE "Subscription" (
  "subscriptionId" bigint generated always as identity,
  "accountId" bigint NOT NULL,
  "profileId" bigint NOT NULL,
  "start" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "end" timestamp with time zone NOT NULL,
  "type" varchar NOT NULL,
  "level" varchar NOT NULL,
  "isActive" boolean NOT NULL
);

ALTER TABLE "Subscription" ADD CONSTRAINT "pkSubscription" PRIMARY KEY ("subscriptionId");
ALTER TABLE "Subscription" ADD CONSTRAINT "fkSubscriptionAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId");
ALTER TABLE "Subscription" ADD CONSTRAINT "fkSubscriptionProfile" FOREIGN KEY ("profileId") REFERENCES "Profile" ("profileId");

CREATE TABLE "SubPayment" (
  "subPaymentId" bigint generated always as identity,
  "subscriptionId" bigint NOT NULL,
  "date" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "amount" bigint NOT NULL,
  "state" varchar NOT NULL
);

ALTER TABLE "SubPayment" ADD CONSTRAINT "pkSubPayment" PRIMARY KEY ("subPaymentId");
ALTER TABLE "SubPayment" ADD CONSTRAINT "fkSubPaymentSubscription" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("subscriptionId");

CREATE TABLE "Trial" (
  "trialId" bigint generated always as identity,
  "accountId" bigint NOT NULL,
  "start" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "end" timestamp with time zone NOT NULL,
  "isExpired" boolean NOT NULL DEFAULT false
);

ALTER TABLE "Trial" ADD CONSTRAINT "pkTrial" PRIMARY KEY ("trialId");
ALTER TABLE "Trial" ADD CONSTRAINT "fkTrialAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("accountId");
