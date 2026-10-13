import { NextRequest } from "next/server";
import { projectService } from "@/features/projects/service";
import { projectFilterSchema } from "@/features/projects/schemas";
import { apiError, apiSuccess } from "@/lib/api/response";

/**
 * GET /api/v1/projects
 * Public endpoint: returns paginated published projects.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const validatedFilter = projectFilterSchema.parse(query);

    const { items, total } = await projectService.getPublicProjects(validatedFilter);

    return apiSuccess(items, {
      page: validatedFilter.page,
      limit: validatedFilter.limit,
      total,
      hasMore: validatedFilter.page * validatedFilter.limit < total,
    });
  } catch (error) {
    return apiError(error);
  }
}
