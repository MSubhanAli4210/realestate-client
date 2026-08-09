import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import ListingFeed from "./features/listings/ListingFeed";
import CreateListing from "./features/listings/CreateListing";
import ListingDetail from "./features/listings/ListingDetail";
import EditListing from "./features/listings/EditListing";
import MyListings from "./features/listings/MyListings";
import Favourites from "./features/favourites/Favourites";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ListingFeed />} />
        <Route path="/listings/:id" element={<ListingDetail />} />

        {/* Placeholder protected routes — we'll build these pages next */}
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/new"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listings/:id/edit"
          element={
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
