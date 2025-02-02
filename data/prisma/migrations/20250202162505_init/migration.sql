-- CreateTable
CREATE TABLE "checkin" (
    "eqId" SERIAL NOT NULL,
    "fsId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tz" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,
    "tripId" INTEGER,

    CONSTRAINT "checkin_pkey" PRIMARY KEY ("eqId")
);

-- CreateTable
CREATE TABLE "venue" (
    "eqId" SERIAL NOT NULL,
    "fsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "postalCode" TEXT,
    "cc" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "category" TEXT,
    "icon" TEXT,
    "hotelChecked" BOOLEAN NOT NULL DEFAULT false,
    "restaurantChecked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "venue_pkey" PRIMARY KEY ("eqId")
);

-- CreateTable
CREATE TABLE "hotel" (
    "eqId" SERIAL NOT NULL,
    "michelinId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "award" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "hotel_pkey" PRIMARY KEY ("eqId")
);

-- CreateTable
CREATE TABLE "restaurant" (
    "eqId" SERIAL NOT NULL,
    "michelinId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "award" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("eqId")
);

-- CreateTable
CREATE TABLE "trip" (
    "eqId" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("eqId")
);

-- CreateTable
CREATE TABLE "flight" (
    "eqId" SERIAL NOT NULL,
    "flightyId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "airline" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "fromAirport" TEXT NOT NULL,
    "toAirport" TEXT NOT NULL,
    "departureTerminal" TEXT,
    "departureGate" TEXT,
    "arrivalTerminal" TEXT,
    "arrivalGate" TEXT,
    "canceled" BOOLEAN NOT NULL DEFAULT false,
    "divertedTo" TEXT,
    "scheduledDeparture" TIMESTAMP(3),
    "actualDeparture" TIMESTAMP(3),
    "scheduledTakeoff" TIMESTAMP(3),
    "actualTakeoff" TIMESTAMP(3),
    "scheduledLanding" TIMESTAMP(3),
    "actualLanding" TIMESTAMP(3),
    "scheduledArrival" TIMESTAMP(3),
    "actualArrival" TIMESTAMP(3),
    "aircraftType" TEXT,
    "tailNumber" TEXT,
    "pnr" TEXT,
    "seat" TEXT,
    "seatType" TEXT,
    "cabinClass" TEXT,
    "flightReason" TEXT,
    "notes" TEXT,
    "airlineFlightyId" TEXT,
    "depAirportFlightyId" TEXT,
    "arrAirportFlightyId" TEXT,
    "divAirportFlightyId" TEXT,
    "aircraftFlightyId" TEXT,

    CONSTRAINT "flight_pkey" PRIMARY KEY ("eqId")
);

-- CreateTable
CREATE TABLE "home" (
    "eqId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "airports" TEXT[],

    CONSTRAINT "home_pkey" PRIMARY KEY ("eqId")
);

-- CreateTable
CREATE TABLE "_flightTotrip" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_flightTotrip_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "checkin_fsId_key" ON "checkin"("fsId");

-- CreateIndex
CREATE UNIQUE INDEX "venue_fsId_key" ON "venue"("fsId");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_michelinId_key" ON "hotel"("michelinId");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_venueId_key" ON "hotel"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_michelinId_key" ON "restaurant"("michelinId");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_venueId_key" ON "restaurant"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "flight_flightyId_key" ON "flight"("flightyId");

-- CreateIndex
CREATE UNIQUE INDEX "home_name_key" ON "home"("name");

-- CreateIndex
CREATE INDEX "_flightTotrip_B_index" ON "_flightTotrip"("B");

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("eqId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("eqId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel" ADD CONSTRAINT "hotel_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("eqId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("eqId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_flightTotrip" ADD CONSTRAINT "_flightTotrip_A_fkey" FOREIGN KEY ("A") REFERENCES "flight"("eqId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_flightTotrip" ADD CONSTRAINT "_flightTotrip_B_fkey" FOREIGN KEY ("B") REFERENCES "trip"("eqId") ON DELETE CASCADE ON UPDATE CASCADE;
