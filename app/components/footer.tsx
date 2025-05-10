import { Github } from "lucide-react";
import { Link } from "@remix-run/react";

export function Footer() {
  return (
    <footer className="border-t py-6 bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} OER Schema. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <Link 
            to="https://github.com/oerschema" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Github size={18} />
            <span>GitHub Repository</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}