import { createClient } from "@supabase/supabase-js";

import {
  type TripGenerationResponse,
  tripGenerationResponseSchema,
} from "@/src/features/trips/contracts";

export interface SharedTripRecord {
  tripId: string;
  trip: TripGenerationResponse;
  createdAt: Date;
  expiresAt: Date;
}

export interface TripShareStore {
  save(record: SharedTripRecord): Promise<void>;
  findByTripId(tripId: string, now: Date): Promise<SharedTripRecord | null>;
}

export function getDefaultShareExpiration(now: Date) {
  const expiresAt = new Date(now);
  expiresAt.setUTCDate(expiresAt.getUTCDate() + 7);
  return expiresAt;
}

export function createInMemoryTripShareStore(): TripShareStore {
  const records = new Map<string, SharedTripRecord>();

  return {
    async save(record) {
      records.set(record.tripId, record);
    },
    async findByTripId(tripId, now) {
      const record = records.get(tripId);

      if (!record || record.expiresAt.getTime() <= now.getTime()) {
        return null;
      }

      return record;
    },
  };
}

interface SupabaseTripShareRow {
  trip_id: string;
  trip_result: unknown;
  created_at: string;
  expires_at: string;
}

interface SupabaseTripShareStoreOptions {
  supabaseUrl: string;
  supabaseSecretKey: string;
}

export function createSupabaseTripShareStore(
  options: SupabaseTripShareStoreOptions,
): TripShareStore {
  const client = createClient(options.supabaseUrl, options.supabaseSecretKey, {
    auth: {
      persistSession: false,
    },
  });

  return {
    async save(record) {
      const { error } = await client.from("trip_shares").upsert({
        trip_id: record.tripId,
        trip_result: record.trip,
        created_at: record.createdAt.toISOString(),
        expires_at: record.expiresAt.toISOString(),
      });

      if (error) {
        throw new Error("Failed to save shared trip result.");
      }
    },
    async findByTripId(tripId, now) {
      const { data, error } = await client
        .from("trip_shares")
        .select("trip_id, trip_result, created_at, expires_at")
        .eq("trip_id", tripId)
        .gt("expires_at", now.toISOString())
        .maybeSingle<SupabaseTripShareRow>();

      if (error) {
        throw new Error("Failed to load shared trip result.");
      }

      if (!data) {
        return null;
      }

      return {
        tripId: data.trip_id,
        trip: tripGenerationResponseSchema.parse(data.trip_result),
        createdAt: new Date(data.created_at),
        expiresAt: new Date(data.expires_at),
      };
    },
  };
}

const fallbackStore = createInMemoryTripShareStore();

export function createDefaultTripShareStore(env: Record<string, string | undefined>) {
  if (env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SECRET_KEY) {
    return createSupabaseTripShareStore({
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseSecretKey: env.SUPABASE_SECRET_KEY,
    });
  }

  return fallbackStore;
}
