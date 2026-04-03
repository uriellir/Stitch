import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/screens/Layout";
import { Home } from "./components/screens/Home";
import { Closet } from "./components/screens/Closet";
import { Collections } from "./components/screens/Collections";
import { CreateCollection } from "./components/screens/CreateCollection";
import { AddItem } from "./components/screens/AddItem";
import { CollectionDetails } from "./components/screens/CollectionDetails";

import { AddItemsToCollection } from "./components/screens/AddItemsToCollection";
import ItemDetails from "./components/screens/ItemDetails";
import OutfitResult from "./components/screens/OutfitResult";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, Component: Home },
            { path: "closet", Component: Closet },
            { path: "collections", Component: Collections },
            { path: "collections/create", Component: CreateCollection },
            { path: "collections/:id", Component: CollectionDetails},
            { path: "collections/:id/edit", Component: CreateCollection },
            { path: "collections/:id/add-items", Component: AddItemsToCollection },
            { path: "add-item", Component: AddItem },
            { path: "outfit/result", Component: OutfitResult },
            { path: "item/:id", Component: ItemDetails },
        ]
    }
]);