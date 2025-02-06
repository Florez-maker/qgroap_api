import ProtectedRoute from "@/context/RouteProtected.js";
import Home from "@/pages/Home.js";
import Login from "@/pages/login";
import LayoutAdmin from "@/components/layouts/admin/layout";
import Clients from "@/pages/clients";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ClientProductions from "@/pages/clientProductions";
import ClientSoils from "@/pages/clientSoils";
import PanelCaneSugar from "@/pages/panelsCaneSugar";
import PanelPalm from "@/pages/panelsPalm";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route
            path="/clients"
            element={
              <LayoutAdmin>
                <Clients />
              </LayoutAdmin>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route
            path="/client_productions"
            element={
              <LayoutAdmin>
                <ClientProductions />
              </LayoutAdmin>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route
            path="/client_soils"
            element={
              <LayoutAdmin>
                <ClientSoils />
              </LayoutAdmin>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route
            path="/panel_canesugar"
            element={
              <LayoutAdmin>
                <PanelCaneSugar />
              </LayoutAdmin>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route
            path="/panel_palm"
            element={
              <LayoutAdmin>
                <PanelPalm />
              </LayoutAdmin>
            }
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route
            path="/"
            element={
              <LayoutAdmin>
                <Home />
              </LayoutAdmin>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
