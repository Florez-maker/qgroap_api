import { AuthProvider } from "@/context/AuthContext";
import AppRoutes from "@/routes/index";

function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </>
  );
}

export default App;
