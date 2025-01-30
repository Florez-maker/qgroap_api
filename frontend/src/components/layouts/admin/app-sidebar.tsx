import * as React from "react";
import { Link } from "react-router-dom";
import { NavMain } from "@/components/layouts/admin/nav-main";
import { NavUser } from "@/components/layouts/admin/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { PiFarmFill } from "react-icons/pi";
import { GiFarmTractor } from "react-icons/gi";
import { GiFarmer } from "react-icons/gi";
import { GiGroundSprout } from "react-icons/gi";

const data = {
  user: {
    name: "Nombre de usuario",
    email: "usuario@usuario.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Clientes",
      url: "#",
      icon: PiFarmFill,
      items: [
        {
          title: "Clientes",
          url: "/clients",
          icon: GiFarmer,
        },
        {
          title: "Producción",
          url: "/client_productions",
          icon: GiFarmTractor,
        },
        {
          title: "Suelos",
          url: "/client_soils",
          icon: GiGroundSprout,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={"/"}>
                <div className={"flex w-full items-center justify-center"}>
                  <img className={"block h-auto w-full max-w-[50%]"} src={"/logo.png"} alt={"Logo App"} />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
