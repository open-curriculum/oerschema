import { Link, useLocation } from "@remix-run/react";
import { cn } from "~/lib/utils";

const navItems = [
	{ name: "Dashboard", href: "/" },
	{ name: "Schema", href: "/schema" },
	{ name: "Graph", href: "/graph" },
	{ name: "Examples", href: "/examples" }
];

export function Sidebar() {
	const location = useLocation();

	return (
		<div className="sticky top-0 flex h-screen w-64 flex-col border-r bg-background overflow-y-auto">
			<div className="flex h-20 items-center justify-center px-4 sticky top-0 bg-background z-10">
				<Link to="/" className="flex items-center">
					<img src="/logo.png" alt="OER Schema" className="h-12" />
				</Link>
			</div>
			<nav className="flex-1 space-y-1 p-4">
				{navItems.map((item) => (
					<Link
						key={item.name}
						to={item.href}
						className={cn(
							"group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
							location.pathname === item.href
								? "bg-accent text-accent-foreground"
								: "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
						)}
					>
						{item.name}
					</Link>
				))}
			</nav>
		</div>
	);
}