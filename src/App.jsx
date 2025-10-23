import './App.css';
import Sidebar from './core/Components/Sidebar.jsx';
import { useSidebar } from './core/Components/sidebarCntext.jsx';
import { RoutesAccessibleWithoutAuth } from './core/Routes/router.accesible.jsx';
import { AppRoutesUser } from './core/Routes/router.jsx';
import { useValidatorRoute } from './validatorRoute.js';
function App() {
  const { isPublicRoute, isAdminRoute, isUserRoute } = useValidatorRoute();
  const { isOpen } = useSidebar();
  
  {
    // aqui estan las paginas que son accesibles sin autenticacion
    // Login, registro, recuperar contraseña y landing page
  }
  if (isPublicRoute) {
    return (
      <RoutesAccessibleWithoutAuth />
    )
  }

  { 
    // aqui van las rutas para usuarios autenticados de tipo user
  }
  if (isUserRoute) {
    return (
      <div className='w-screen h-screen'>
        <Sidebar />
        <main className={`flex-1 h-full transition-all duration-300 ${isOpen ? 'pl-80' : 'pl-32'} p-6`}>
          <AppRoutesUser />
        </main>
      </div>
    )
  }
  {
    // aqui van las rutas para usuarios autenticados de tipo admin
  }
  if (isAdminRoute) {
    return (
      <div className='w-screen h-screen'>
        sidebar de admin
        <main className={`flex-1 h-full transition-all duration-300 ${isOpen ? 'pl-80' : 'pl-32'} p-6`}>
          <h1>Rutas de administrador</h1>
        </main>
      </div>
    )
  }
  return (
    <div className='w-screen h-screen'>
      <main className={`flex-1 h-full transition-all duration-300 `}>
        <h1>Ruta no encontrada</h1>
      </main>
    </div>
  )
}

export default App
