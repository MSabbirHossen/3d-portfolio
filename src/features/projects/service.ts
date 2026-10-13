import { IProjectRepository, projectRepository } from "./repository";
import { CreateProjectDto, Project, ProjectFilter, UpdateProjectDto } from "./types";
import { AppError } from "@/lib/api/errors";

export class ProjectService {
  constructor(private repo: IProjectRepository = projectRepository) {}

  /**
   * Public query: Returns ONLY published projects. Drafts are never leaked.
   */
  async getPublicProjects(
    filter?: Omit<ProjectFilter, "status">
  ): Promise<{ items: Project[]; total: number }> {
    return this.repo.findMany({
      ...filter,
      status: "published",
    });
  }

  /**
   * Public detail: Returns project by slug only if published.
   */
  async getPublicProjectBySlug(slug: string): Promise<Project> {
    const project = await this.repo.findBySlug(slug);
    if (!project || project.status !== "published") {
      throw AppError.notFound("Project");
    }
    return project;
  }

  /**
   * Admin query: Returns all projects with optional status filter.
   */
  async getAdminProjects(
    filter?: ProjectFilter
  ): Promise<{ items: Project[]; total: number }> {
    return this.repo.findMany(filter);
  }

  /**
   * Create new project: validates slug collision.
   */
  async createProject(dto: CreateProjectDto): Promise<Project> {
    const existing = await this.repo.findBySlug(dto.slug);
    if (existing) {
      throw AppError.conflict(`Project with slug "${dto.slug}" already exists`);
    }
    return this.repo.create(dto);
  }

  /**
   * Update existing project: validates existence and unique slug.
   */
  async updateProject(id: string, dto: UpdateProjectDto): Promise<Project> {
    const current = await this.repo.findById(id);
    if (!current) {
      throw AppError.notFound("Project");
    }

    if (dto.slug && dto.slug !== current.slug) {
      const collision = await this.repo.findBySlug(dto.slug);
      if (collision && collision.id !== id) {
        throw AppError.conflict(`Slug "${dto.slug}" is already taken`);
      }
    }

    const updated = await this.repo.update(id, dto);
    if (!updated) {
      throw AppError.internal("Failed to update project");
    }
    return updated;
  }

  /**
   * Delete project by ID.
   */
  async deleteProject(id: string): Promise<void> {
    const current = await this.repo.findById(id);
    if (!current) {
      throw AppError.notFound("Project");
    }
    await this.repo.delete(id);
  }
}

export const projectService = new ProjectService();
