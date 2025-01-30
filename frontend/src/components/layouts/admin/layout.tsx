import React from "react";
import { AppSidebar } from "@/components/layouts/admin/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
      <SidebarProvider>
        <AppSidebar />
        <main
            className={
              "relative flex min-h-svh flex-1 flex-col bg-background peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow"
            }
        >
          <header className="sticky flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <div data-orientation="vertical" role="none" className="mr-2 h-4 w-[1px] shrink-0 bg-border"></div>
              <nav aria-label="breadcrumb">
                  <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">

                      <li role="presentation" aria-hidden="true"
                          className="[&amp;>svg]:w-3.5 [&amp;>svg]:h-3.5 hidden md:block">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-right"
                          >
                              <path d="m9 18 6-6-6-6"></path>
                          </svg>
                      </li>

                      <li aria-hidden="true" className="inline-flex items-center gap-1.5">
                          <Link to="/" className="font-normal text-foreground">
                              <FaHome size={18}/>
                          </Link>
                      </li>

                  </ol>
              </nav>
            </div>
          </header>
            <div className={"block px-4 py-2"}>{children}</div>

        </main>
          <Toaster/>
      </SidebarProvider>
  );
}
