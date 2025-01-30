import Home from "@/pages/Home.js";
import Clients from "@/pages/clients";
import ClientProductions from "@/pages/clientProductions";

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
];

export default routes_lists;
