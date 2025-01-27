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

-- CreateIndex
CREATE UNIQUE INDEX "flight_flightyId_key" ON "flight"("flightyId");
