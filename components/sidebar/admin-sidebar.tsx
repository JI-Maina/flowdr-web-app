"use client";

import { memo } from "react";
// import { useTheme } from "next-themes";
import { useFlowdrStore } from "@/store/store";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Database,
  // Users,
  // Activity,
  // Shield,
  // Zap,
  // Bell,
  // Settings,
  // Moon,
  // Sun,
  User,
} from "lucide-react";
import { LogoIcon } from "../logo";

export const AdminSidebar = memo(() => {
  // const { theme, setTheme } = useTheme();
  const companyId = useFlowdrStore((state) => state.store.user.companyId);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: `/company/${companyId}`,
    },
    {
      title: "My Business",
      icon: Database,
      href: `/company/${companyId}/companies`,
    },
    {
      title: "Products",
      icon: BarChart3,
      href: `/company/${companyId}/products`,
    },
    { title: "Orders", icon: FileText, href: `/company/${companyId}/orders` },
    // { title: "Users", icon: Users, href: "#users" },
    // { title: "Activity", icon: Activity, href: "#activity" },
    // { title: "Security", icon: Shield, href: "#security" },
    // { title: "Performance", icon: Zap, href: "#performance" },
    // { title: "Notifications", icon: Bell, href: "#notifications" },
    // { title: "Settings", icon: Settings, href: "#settings" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link prefetch={false} href="#dashboard">
                <div className="bg-gray-50 text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LogoIcon />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Flowdr</span>
                  <span className="truncate text-xs">
                    Your Business in Flow
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link prefetch={false} href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="#profile">
                <User />
                <span>Admin Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

AdminSidebar.displayName = "AdminSidebar";
