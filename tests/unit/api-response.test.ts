import { describe, it, expect } from "vitest";
import { apiSuccess, apiError } from "@/lib/api/response";
import { AppError } from "@/lib/api/errors";
import { z } from "zod";

describe("API Response & Error Envelopes", () => {
  it("serializes successful response with data and meta", async () => {
    const res = apiSuccess({ id: 1, name: "Test" }, { total: 1 });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toEqual({ id: 1, name: "Test" });
    expect(json.meta).toEqual({ total: 1 });
  });

  it("serializes AppError with typed code and HTTP status", async () => {
    const error = AppError.forbidden("Admin only");
    const res = apiError(error);
    const json = await res.json();
    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("FORBIDDEN");
    expect(json.error.message).toBe("Admin only");
  });

  it("serializes ZodError as 422 with field errors", async () => {
    const schema = z.object({ email: z.string().email() });
    const parseResult = schema.safeParse({ email: "invalid-email" });
    expect(parseResult.success).toBe(false);

    if (!parseResult.success) {
      const res = apiError(parseResult.error);
      const json = await res.json();
      expect(res.status).toBe(422);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("UNPROCESSABLE_ENTITY");
      expect(json.error.details.email).toBeDefined();
    }
  });
});
