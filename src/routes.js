
import Index from "views/Index.js";
import Maps from "views/Maps.js";


var routes = [
  {
    path: "/index",
    name: "DENGUE CRUD VISUAL",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },

  {
    path: "/Maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  
 
  
];
export default routes;
