import ProtectedRoute from "@/context/RouteProtected.js";
import Home from "@/pages/Home.js";
import Login from "@/pages/login";
import LayoutAdmin from "@/components/layouts/admin/layout";
import Clients from "@/pages/clients";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CLientProductions from "@/pages/clientProductions";

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
                <CLientProductions />
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
