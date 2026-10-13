import { z } from "zod";
import {
  projectSchema,
  createProjectDtoSchema,
  updateProjectDtoSchema,
  projectFilterSchema,
  projectStatusSchema,
} from "./schemas";

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CreateProjectDto = z.infer<typeof createProjectDtoSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectDtoSchema>;
export type ProjectFilter = z.infer<typeof projectFilterSchema>;
