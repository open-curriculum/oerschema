import { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { Menu, X } from "lucide-react";
import { cn, withBase } from "~/lib/utils";
import { Button } from "./ui/button";
import { useTheme } from "./ui/theme-provider";

// Use the withBase utility for navigation paths
const navItems = [
	{ name: "Schema", href: "/" }, // The root path will be handled by Remix
	{ name: "Components", href: "/components" },
	{ name: "Examples", href: "/examples" },
	{ name: "Plugin", href: "/plugin" },
	{ name: "About", href: "/about" }
];

export function Sidebar() {
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);
	const { theme } = useTheme();
	
	// Close sidebar on route change on mobile
	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname]);

	// Close sidebar when screen size becomes large
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsOpen(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const logoSrc = withBase(
		theme === 'dark' ? 'oerschema-logo-white.png' : 'oerschema-logo-black.png'
	);

	return (
		<>
			{/* Mobile hamburger menu in the top bar */}
			<div className="lg:hidden absolute top-0 left-0 z-40 p-2">
				<Button 
					variant="ghost" 
					size="icon" 
					onClick={() => setIsOpen(!isOpen)} 
					aria-label="Toggle menu"
				>
					<Menu className="h-6 w-6" />
				</Button>
			</div>

			{/* Overlay for mobile when sidebar is open */}
			{isOpen && (
				<div 
					className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
					onClick={() => setIsOpen(false)}
				></div>
			)}

			{/* Sidebar */}
			<div 
				className={cn(
					"fixed lg:sticky top-0 h-screen w-64 flex-col border-r bg-background overflow-y-auto z-40 transition-all duration-300",
					isOpen ? "flex translate-x-0 shadow-lg" : "hidden lg:flex -translate-x-full lg:translate-x-0"
				)}
			>
				{/* Close button on mobile */}
				<div className="lg:hidden absolute top-4 right-4">
					<Button 
						variant="ghost" 
						size="icon" 
						onClick={() => setIsOpen(false)}
						aria-label="Close menu"
					>
						<X className="h-5 w-5" />
					</Button>
				</div>

				<div className="flex h-20 items-center justify-center px-4 sticky top-0 bg-background z-10">
					<Link to="/" className="flex items-center">
						<img src={logoSrc} alt="OER Schema" className="h-12" />
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
		</>
	);
}