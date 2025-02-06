import Home from "@/pages/Home.js";
import Clients from "@/pages/clients";
import ClientProductions from "@/pages/clientProductions";
import PanelCaneSugar from "@/pages/panelsCaneSugar";
import PanelPalm from "@/pages/panelsPalm";
import ClientSoils from "@/api/ClientSoils";

const routes_lists = [
  {
    path: "/",
    component: Home,
    allowedRoles: ["admin"],
  },
  {
    path: "/clients",
    component: Clients,
    allowedRoles: ["admin"],
  },
  {
    path: "/client_productions",
    component: ClientProductions,
    allowedRoles: ["admin"],
  },
  {
    path: "/client_soils",
    component: ClientSoils,
    allowedRoles: ["admin"],
  },
  {
    path: "/panel_palm",
    component: PanelPalm,
    allowedRoles: ["admin"],
  },
  {
    path: "/panel_canesugar",
    component: PanelCaneSugar,
    allowedRoles: ["admin"],
  },
];

export default routes_lists;
