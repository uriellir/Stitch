import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/screens/Layout";
import { Home } from "./components/screens/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            // {
            //     path: "closet",
            //     element: <Closet />
            // }
        ]
    }
]);