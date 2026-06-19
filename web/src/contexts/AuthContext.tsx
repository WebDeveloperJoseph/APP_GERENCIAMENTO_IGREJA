import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  getStoredUser,
  getToken,
  saveSession,
  clearSession,
} from "@/services/api";
import { authService } from "@/services/authService";

export interface User {
  id?: string;
  name: string;
  email: string;
  churchId?: string | null;
  isSuperAdmin: boolean;
  role: string;
}
// 1. Definimos o formato do que vai ter dentro da caixa
interface AuthContextType {
  user: User | null;
  setUser: (user: any) => void;
  authChecked: boolean;
}

// 2. Criamos o contexto (a "caixa")
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Criamos o Provider (quem entrega os dados para os filhos)
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState(null);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    return getStoredUser<User>();
  });
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  const updateUser = (newUser: User | null) => {
    setUser(newUser);

    // Keep user/church info aligned with API session storage.
    saveSession(getToken(), newUser?.churchId ?? null, newUser);
    // mark that auth state is known (login flow)
    if (newUser) setAuthChecked(true);
  };

  // On mount, validate session with backend (/auth/me).
  useEffect(() => {
    let mounted = true;

    async function validate() {
      const token = getToken();
      const stored = getStoredUser();

      if (!token && !stored) {
        setAuthChecked(true);
        return;
      }

      try {
        const freshUser = await authService.me();
        if (!mounted) return;
        updateUser(freshUser as User);
      } catch (err) {
        // Clear any stale session if validation fails
        clearSession();
        if (!mounted) return;
        updateUser(null);
      } finally {
        if (!mounted) return;
        setAuthChecked(true);
      }
    }

    validate();

    return () => {
      mounted = false;
    };
  }, []);

  // Listen to manual session clear events and redirect to login
  useEffect(() => {
    const handler = () => {
      setUser(null);
      try {
        navigate("/login");
      } catch (e) {
        // ignore if navigation not available
      }
    };

    window.addEventListener("session:cleared", handler as EventListener);
    return () =>
      window.removeEventListener("session:cleared", handler as EventListener);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. O "useAuth" que você vai importar nos seus componentes
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
