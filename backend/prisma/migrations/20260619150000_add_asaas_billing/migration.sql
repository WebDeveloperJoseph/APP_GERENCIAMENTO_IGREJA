CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'CONFIRMED', 'RECEIVED', 'OVERDUE', 'REFUNDED', 'CANCELED');
CREATE TYPE "BillingEventStatus" AS ENUM ('PENDING', 'PROCESSED', 'FAILED');

CREATE TABLE "invoices" (
  "id" TEXT NOT NULL,
  "subscriptionId" TEXT NOT NULL,
  "gateway" TEXT NOT NULL DEFAULT 'ASAAS',
  "externalId" TEXT NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
  "valueCents" INTEGER NOT NULL,
  "billingType" TEXT,
  "dueDate" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "invoiceUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "billing_events" (
  "id" TEXT NOT NULL,
  "gateway" TEXT NOT NULL DEFAULT 'ASAAS',
  "externalId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" "BillingEventStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  CONSTRAINT "billing_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "invoices_gateway_externalId_key" ON "invoices"("gateway", "externalId");
CREATE INDEX "invoices_subscriptionId_status_idx" ON "invoices"("subscriptionId", "status");
CREATE UNIQUE INDEX "billing_events_gateway_externalId_key" ON "billing_events"("gateway", "externalId");
CREATE INDEX "billing_events_status_receivedAt_idx" ON "billing_events"("status", "receivedAt");

ALTER TABLE "invoices" ADD CONSTRAINT "invoices_subscriptionId_fkey"
  FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
