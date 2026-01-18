"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiScissors, FiCalendar, FiUsers, FiMessageCircle, FiBookmark } from "react-icons/fi";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "Dashboard", href: "/dashboard", icon: FiGrid },
    { name: "Wardrobe", href: "/dashboard/wardrobe", icon: FiGrid },
    { name: "Styling", href: "/dashboard/styling", icon: FiScissors },
    { name: "Planning", href: "/dashboard/planning", icon: FiCalendar },
    { name: "Community", href: "/dashboard/community", icon: FiUsers },
    { name: "StyleChat", href: "/dashboard/stylechat", icon: FiMessageCircle },
    { name: "Saved", href: "/dashboard/saved", icon: FiBookmark },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 min-h-screen flex flex-col p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 px-4 mb-8">
                <h1 className="text-xl font-bold">WearWhat</h1>
            </div>
            <nav className="flex flex-col gap-2">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors",
                                isActive
                                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            )}
                        >
                            <link.icon className="w-5 h-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
