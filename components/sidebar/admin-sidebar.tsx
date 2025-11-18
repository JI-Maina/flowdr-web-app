"use client";

import { memo, useState } from "react";
import { useFlowdrStore } from "@/store/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Database,
  Activity,
  Users,
  User,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  ClipboardList,
  Truck,
  UserCog,
  Building,
  CreditCard,
  Receipt,
} from "lucide-react";
import { LogoIcon } from "../logo";

export const AdminSidebar = memo(() => {
  const companyId = useFlowdrStore((state) => state.store.user.companyId);
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const toggleMenu = (menuTitle: string) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuTitle)) {
        newSet.delete(menuTitle);
      } else {
        newSet.add(menuTitle);
      }
      return newSet;
    });
  };

  const isMenuOpen = (menuTitle: string) => openMenus.has(menuTitle);

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
    {
      title: "Inventory",
      icon: Activity,
      href: `/company/${companyId}/inventories`,
    },
    {
      title: "Orders",
      icon: FileText,
      href: `/company/${companyId}/orders/sale`,
      subItems: [
        {
          title: "Purchase Orders",
          icon: ShoppingCart,
          href: `/company/${companyId}/orders/purchase`,
        },
        {
          title: "Requisition Orders",
          icon: ClipboardList,
          href: `/company/${companyId}/orders/requisition`,
        },
        {
          title: "Sale Orders",
          icon: Truck,
          href: `/company/${companyId}/orders/sale`,
        },
      ],
    },
    {
      title: "Payments",
      icon: CreditCard,
      href: `/company/${companyId}/payments/invoices`,
      subItems: [
        {
          title: "Invoices",
          icon: FileText,
          href: `/company/${companyId}/payments/invoices`,
        },
        {
          title: "Bills",
          icon: Receipt,
          href: `/company/${companyId}/payments/bills`,
        },
      ],
    },
    {
      title: "Users",
      icon: Users,
      href: `/company/${companyId}/users/customers`,
      subItems: [
        {
          title: "Customers",
          icon: Users,
          href: `/company/${companyId}/users/customers`,
        },
        // {
        //   title: "Staffs",
        //   icon: UserCog,
        //   href: `/company/${companyId}/users/staffs`,
        // },
        {
          title: "Vendors",
          icon: Building,
          href: `/company/${companyId}/users/vendors`,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link prefetch={false} href={`/company/${companyId}`}>
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
                const isActive = pathname === item.href;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isOpen = isMenuOpen(item.title);

                if (hasSubItems) {
                  const isSubItemActive = item.subItems!.some(
                    (subItem) => pathname === subItem.href
                  );

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        onClick={() => toggleMenu(item.title)}
                        isActive={isSubItemActive || isActive}
                      >
                        <Icon />
                        <span>{item.title}</span>
                        {isOpen ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </SidebarMenuButton>

                      {isOpen && (
                        <SidebarMenuSub className="mt-1">
                          {item.subItems!.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = pathname === subItem.href;

                            return (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                >
                                  <Link prefetch={false} href={subItem.href}>
                                    <SubIcon />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
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
