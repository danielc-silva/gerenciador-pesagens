import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Piquetes from "./Piquetes";
import Bovinos from "./Bovinos";
import PesagensPrivado from "./PesagensPrivado";
import MenuPrivado from "./MenuPrivado";
import MenuPublico from "./MenuPublico";
import Login from "./Login";
import NotFound from "./NotFound";
import Usuario from "./Usuario";
import Sobre from "./Sobre";
import BemVindo from "./BemVindo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MenuPublico />,
    children: [
      {
        index: true,
        element: <BemVindo />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "sobre",
        element: <Sobre />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/privado",
    element: <MenuPrivado />,
    children: [
      {
        index: true,
        element: <BemVindo />,
      },
      {
        path: "usuario",
        element: <Usuario />,
      },
      {
        path: "piquetes",
        element: <Piquetes />,
      },
      {
        path: "bovinos",
        element: <Bovinos />,
      },
      {
        path: "pesagens",
        element: <PesagensPrivado />,
      },
      {
        path: "sobre",
        element: <Sobre />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;