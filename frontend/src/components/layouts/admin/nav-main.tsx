import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";

type IconComponent = LucideIcon | IconType;

interface NavItem {
  title: string;
  url: string;
  icon: IconComponent;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: IconComponent; // Hacemos el icon opcional aquí
  }[];
}
export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Panel de administración</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <div className="flex cursor-pointer items-center">
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <div className="flex flex-1 items-center">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <Link to={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <div>
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
