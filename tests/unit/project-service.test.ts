import { describe, it, expect, beforeEach } from "vitest";
import { ProjectService } from "@/features/projects/service";
import { IProjectRepository } from "@/features/projects/repository";
import { Project, CreateProjectDto } from "@/features/projects/types";
import { AppError } from "@/lib/api/errors";

class MockProjectRepository implements IProjectRepository {
  public projects: Project[] = [];

  async findMany(filter?: { status?: string; category?: string; featured?: boolean }): Promise<{ items: Project[]; total: number }> {
    let res = [...this.projects];
    if (filter?.status) {
      res = res.filter((p) => p.status === filter.status);
    }
    return { items: res, total: res.length };
  }

  async findBySlug(slug: string): Promise<Project | null> {
    return this.projects.find((p) => p.slug === slug) || null;
  }

  async findById(id: string): Promise<Project | null> {
    return this.projects.find((p) => p.id === id) || null;
  }

  async create(data: CreateProjectDto): Promise<Project> {
    const proj: Project = { ...data, id: `test-${Date.now()}` };
    this.projects.push(proj);
    return proj;
  }

  async update(id: string, data: Partial<CreateProjectDto>): Promise<Project | null> {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...data };
    return this.projects[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.projects.splice(idx, 1);
    return true;
  }
}

describe("ProjectService Domain & Publication Logic", () => {
  let mockRepo: MockProjectRepository;
  let service: ProjectService;

  beforeEach(() => {
    mockRepo = new MockProjectRepository();
    service = new ProjectService(mockRepo);

    mockRepo.projects = [
      {
        id: "p1",
        slug: "published-project",
        title: "Published Project",
        category: "Full-Stack",
        summary: "A published project summary.",
        description: "Full description of published project.",
        role: "Lead",
        period: "2026",
        featured: true,
        status: "published",
        technologies: ["React", "Node.js"],
        architecture: [],
        challenges: [],
        lessonsLearned: [],
        futureImprovements: [],
        features: [],
        apiEndpoints: [],
        githubUrl: "https://github.com/example/published",
        liveUrl: "https://published.example.com",
      },
      {
        id: "p2",
        slug: "draft-project",
        title: "Draft Project (In Progress)",
        category: "MERN",
        summary: "An unfinished project in progress.",
        description: "Draft details not ready for public eyes.",
        role: "Developer",
        period: "2026",
        featured: false,
        status: "draft",
        technologies: ["TypeScript"],
        architecture: [],
        challenges: [],
        lessonsLearned: [],
        futureImprovements: [],
        features: [],
        apiEndpoints: [],
        githubUrl: "https://github.com/example/draft",
      },
    ];
  });

  it("returns ONLY published projects on public query and suppresses drafts", async () => {
    const result = await service.getPublicProjects();
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe("published-project");
    expect(result.items.some((p) => p.status === "draft")).toBe(false);
  });

  it("throws 404 NOT_FOUND when a public visitor tries to view a draft project by slug", async () => {
    await expect(service.getPublicProjectBySlug("draft-project")).rejects.toThrow(
      AppError
    );
    await expect(service.getPublicProjectBySlug("draft-project")).rejects.toMatchObject({
      statusCode: 404,
      code: "NOT_FOUND",
    });
  });

  it("successfully retrieves published project by slug", async () => {
    const project = await service.getPublicProjectBySlug("published-project");
    expect(project).toBeDefined();
    expect(project.title).toBe("Published Project");
  });

  it("rejects duplicate slug creation with 409 CONFLICT", async () => {
    await expect(
      service.createProject({
        slug: "published-project",
        title: "Duplicate Attempt",
        category: "Full-Stack",
        summary: "Summary test length.",
        description: "Description test length for validation.",
        role: "Solo",
        period: "2026",
        featured: false,
        status: "draft",
        technologies: ["React"],
        architecture: [],
        challenges: [],
        lessonsLearned: [],
        futureImprovements: [],
        features: [],
        apiEndpoints: [],
        githubUrl: "https://github.com/example/dup",
      })
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "CONFLICT",
    });
  });
});
