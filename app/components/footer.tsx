import { Github } from "lucide-react";
import { Link } from "@remix-run/react";
import { ThemeToggle } from "./ui/theme-toggle";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="border-t py-6 bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          Made with{" "}
          <span className="text-red-500" aria-label="heart" role="img">
            ♥
          </span>{" "}
          by the OER Schema team.
        </p>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link
              to="https://github.com/oerschema"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
              title="View GitHub Repository"
            >
              <Github className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">GitHub Repository</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}