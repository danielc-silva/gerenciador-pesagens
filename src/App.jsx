import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Piquetes from "./Piquetes";
import Bovinos from "./Bovinos";
import PesagensPrivado from "./PesagensPrivado";
import PesagensPublico from "./PesagensPublico";
import MenuPrivado from "./MenuPrivado";
import MenuPublico from "./MenuPublico";
import Login from "./Login";
import NotFound from "./NotFound";
import Usuario from "./Usuario";
import Sobre from "./Sobre";
import BemVindo from "./BemVindo"


const router = createBrowserRouter([
  {
    path : "/",
    element : <MenuPublico/>,
    children : [
        {
          index : true, 
          element : <BemVindo/>
        },
        {
          path : "pesagenspublico",
          element : <PesagensPublico/>
        },
        {
          path : "login",
          element : <Login/>
        },
        {
          path : "sobre",
          element : <Sobre/>
        },
        {
          path : "*",
          element : <NotFound/>
        }
    ]
  },
  {
    path : "/privado",
    element : <MenuPrivado/>,
    children : [
        {
          index : true, 
          element : <BemVindo/>
        },
        {
          path : "login",
          element : <Login/>
        },
        {
          path : "usuario",
          element : <Usuario/>
        },
        {
          path : "sobre",
          element : <Sobre/>
        },
        {
          path : "piquetes",
          element : <Piquetes/>
        },
        {
          path : "bovinos",
          element : <Bovinos/>
        },
        {
          path : "pesagensprivado",
          element : <PesagensPrivado/>
        },
    ]
  }
])


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
