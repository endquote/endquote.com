-- CreateTable
CREATE TABLE "checkin" (
    "eqId" SERIAL NOT NULL,
    "fsId" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
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
    "start" INTEGER NOT NULL,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("eqId")
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
CREATE UNIQUE INDEX "trip_start_key" ON "trip"("start");

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("eqId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("eqId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel" ADD CONSTRAINT "hotel_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("eqId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venue"("eqId") ON DELETE RESTRICT ON UPDATE CASCADE;
