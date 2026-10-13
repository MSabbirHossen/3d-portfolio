import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

describe("Accessible UI Primitives", () => {
  it("renders Button with proper children and primary styles", () => {
    render(<Button>Click Me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it("disables Button and indicates loading state when isLoading is true", () => {
    render(<Button isLoading>Submitting</Button>);
    const btn = screen.getByRole("button", { name: /submitting/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });

  it("renders Badge with success variant text", () => {
    render(<Badge variant="success">Published</Badge>);
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  it("renders Input with error message and aria-invalid", () => {
    render(<Input placeholder="Email" error="Invalid email address" />);
    const input = screen.getByPlaceholderText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });
});
