-- CreateTable
CREATE TABLE "checkin" (
    "fsId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tz" INTEGER NOT NULL,
    "venueId" TEXT NOT NULL,
    "tripId" INTEGER,
    "flightId" TEXT,

    CONSTRAINT "checkin_pkey" PRIMARY KEY ("fsId")
);

-- CreateTable
CREATE TABLE "venue" (
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
    "fsIcon" TEXT,
    "mapIcon" TEXT,
    "airportCode" TEXT,
    "hotelChecked" BOOLEAN NOT NULL DEFAULT false,
    "restaurantChecked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "venue_pkey" PRIMARY KEY ("fsId")
);

-- CreateTable
CREATE TABLE "venueIcon" (
    "fsIcon" TEXT NOT NULL,
    "eqIcon" TEXT,

    CONSTRAINT "venueIcon_pkey" PRIMARY KEY ("fsIcon")
);

-- CreateTable
CREATE TABLE "hotel" (
    "michelinId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "award" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,

    CONSTRAINT "hotel_pkey" PRIMARY KEY ("michelinId")
);

-- CreateTable
CREATE TABLE "restaurant" (
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
    "venueId" TEXT NOT NULL,

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("michelinId")
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
    "flightyId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "airline" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "fromAirportCode" TEXT NOT NULL,
    "toAirportCode" TEXT NOT NULL,
    "departureTerminal" TEXT,
    "departureGate" TEXT,
    "arrivalTerminal" TEXT,
    "arrivalGate" TEXT,
    "canceled" BOOLEAN NOT NULL DEFAULT false,
    "divertedToCode" TEXT,
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

    CONSTRAINT "flight_pkey" PRIMARY KEY ("flightyId")
);

-- CreateTable
CREATE TABLE "home" (
    "eqId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_pkey" PRIMARY KEY ("eqId")
);

-- CreateTable
CREATE TABLE "airport" (
    "code" TEXT NOT NULL,
    "icao" TEXT,
    "name" TEXT NOT NULL,
    "elevation" INTEGER,
    "url" TEXT,
    "timezone" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "county" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "airport_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "_flightTotrip" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_flightTotrip_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_airportTohome" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_airportTohome_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "hotel_venueId_key" ON "hotel"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_venueId_key" ON "restaurant"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "home_name_key" ON "home"("name");

-- CreateIndex
CREATE INDEX "_flightTotrip_B_index" ON "_flightTotrip"("B");

-- CreateIndex
CREATE INDEX "_airportTohome_B_index" ON "_airportTohome"("B");

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flight"("flightyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("eqId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("fsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue" ADD CONSTRAINT "venue_airportCode_fkey" FOREIGN KEY ("airportCode") REFERENCES "airport"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue" ADD CONSTRAINT "venue_fsIcon_fkey" FOREIGN KEY ("fsIcon") REFERENCES "venueIcon"("fsIcon") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel" ADD CONSTRAINT "hotel_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("fsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("fsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_divertedToCode_fkey" FOREIGN KEY ("divertedToCode") REFERENCES "airport"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_fromAirportCode_fkey" FOREIGN KEY ("fromAirportCode") REFERENCES "airport"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight" ADD CONSTRAINT "flight_toAirportCode_fkey" FOREIGN KEY ("toAirportCode") REFERENCES "airport"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_flightTotrip" ADD CONSTRAINT "_flightTotrip_A_fkey" FOREIGN KEY ("A") REFERENCES "flight"("flightyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_flightTotrip" ADD CONSTRAINT "_flightTotrip_B_fkey" FOREIGN KEY ("B") REFERENCES "trip"("eqId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_airportTohome" ADD CONSTRAINT "_airportTohome_A_fkey" FOREIGN KEY ("A") REFERENCES "airport"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_airportTohome" ADD CONSTRAINT "_airportTohome_B_fkey" FOREIGN KEY ("B") REFERENCES "home"("eqId") ON DELETE CASCADE ON UPDATE CASCADE;
