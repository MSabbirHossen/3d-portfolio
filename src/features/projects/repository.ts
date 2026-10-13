import { Project, CreateProjectDto, UpdateProjectDto, ProjectFilter } from "./types";

export interface IProjectRepository {
  findMany(filter?: Partial<ProjectFilter>): Promise<{ items: Project[]; total: number }>;
  findBySlug(slug: string): Promise<Project | null>;
  findById(id: string): Promise<Project | null>;
  create(data: CreateProjectDto): Promise<Project>;
  update(id: string, data: UpdateProjectDto): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}

// In-Memory implementation seeded with audited legacy projects for Phase 1 baseline
const SEED_PROJECTS: Project[] = [
  {
    id: "proj-1",
    slug: "eta-digital-education-platform",
    title: "Exploratory Training Academy (ETA)",
    category: "Full-Stack Education Platform",
    summary:
      "A complete digital education management platform designed for educational institutions operating online, physically, or in a hybrid model.",
    description:
      "Built with TypeScript, React, Node.js, Express, PostgreSQL, and Docker to provide seamless multi-modal learning workflows, automated attendance, dynamic course scheduling, and secure role-based portals.",
    role: "Solo Developer",
    period: "2026",
    featured: true,
    featuredOrder: 1,
    status: "draft", // Staged in draft due to placeholder liveUrl
    technologies: [
      "TypeScript",
      "React 19",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Docker",
      "Tailwind CSS",
      "JWT Auth",
    ],
    architecture: [
      "TypeScript full-stack architecture ensuring type safety across client and backend.",
      "PostgreSQL relational schema modeling complex course hierarchies.",
      "Containerized Docker multi-stage pipeline.",
    ],
    challenges: [
      "Accommodating divergent workflows for online, physical classroom, and hybrid delivery.",
    ],
    lessonsLearned: [
      "Adopting TypeScript across the full stack drastically reduces contract drift.",
    ],
    futureImprovements: ["AI-powered personalized learning recommendations."],
    features: [
      "Multi-modal institution support (online, physical campus, hybrid).",
      "Role-based access control (Super Admin, Instructor, Student).",
    ],
    apiEndpoints: ["GET /api/v1/courses", "POST /api/v1/enrollments"],
    githubUrl: "https://github.com/MSabbirHossen/ETA",
    liveUrl: "https://eta.example.com/",
    coverMediaUrl: "/screenshots/eta-dashboard.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-2",
    slug: "export-import-project",
    title: "Import Export Hub",
    category: "MERN Stack",
    summary:
      "Built a full-stack marketplace connecting exporters and importers, covering product management, import workflows, and authenticated access.",
    description:
      "Implemented with React, Node.js/Express, MongoDB Atlas, Firebase, and security middleware to demonstrate MVC architecture, secure API design, and production-focused deployment.",
    role: "Full Stack Developer",
    period: "2026 · 2-week build",
    featured: true,
    featuredOrder: 2,
    status: "published",
    technologies: ["React 19", "Node.js", "Express.js", "MongoDB", "Firebase"],
    architecture: ["MVC pattern with Express and MongoDB Atlas."],
    challenges: ["Handling concurrent marketplace inquiries."],
    lessonsLearned: ["Effective indexing for search and filter pipelines."],
    futureImprovements: ["Real-time buyer-seller chat."],
    features: ["Exporter directory", "Order tracking", "Role authorization"],
    apiEndpoints: ["GET /api/v1/products"],
    githubUrl: "https://github.com/MSabbirHossen/export-import-project",
    liveUrl: "https://import-export-hub-client.vercel.app/",
    coverMediaUrl: "/screenshots/import-export-hub-hero.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class InMemoryProjectRepository implements IProjectRepository {
  private projects: Project[] = [...SEED_PROJECTS];

  async findMany(filter?: Partial<ProjectFilter>): Promise<{ items: Project[]; total: number }> {
    let result = [...this.projects];

    if (filter?.status) {
      result = result.filter((p) => p.status === filter.status);
    }
    if (filter?.category) {
      result = result.filter(
        (p) => p.category.toLowerCase() === filter.category?.toLowerCase()
      );
    }
    if (filter?.featured !== undefined) {
      result = result.filter((p) => p.featured === filter.featured);
    }

    const total = result.length;
    const page = filter?.page || 1;
    const limit = filter?.limit || 20;
    const items = result.slice((page - 1) * limit, page * limit);

    return { items, total };
  }

  async findBySlug(slug: string): Promise<Project | null> {
    return this.projects.find((p) => p.slug === slug) || null;
  }

  async findById(id: string): Promise<Project | null> {
    return this.projects.find((p) => p.id === id) || null;
  }

  async create(data: CreateProjectDto): Promise<Project> {
    const project: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.push(project);
    return project;
  }

  async update(id: string, data: UpdateProjectDto): Promise<Project | null> {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = {
      ...this.projects[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.projects[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.projects.splice(idx, 1);
    return true;
  }
}

export const projectRepository: IProjectRepository = new InMemoryProjectRepository();
