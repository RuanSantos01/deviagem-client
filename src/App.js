import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";

// PAGES
import HomePage from "scenes/homePage";
import ForgotPasswordPage from "scenes/forgotPasswordPage";
import ConfirmEmailPage from "scenes/confirmEmailPage";
import AccommodationPage from "scenes/accommodationPage";
import LoginPage from "scenes/loginPage";
import ReserveAccommodation from "scenes/accommodationPage/reserveAccommodation";
import CartPage from "scenes/cartPage";
import PaymentPage from "scenes/paymentPage";
import FinalPage from "scenes/paymentPage/finalPage";
import PackagePage from "scenes/packagePage";
import PackageCartPage from "scenes/cartPage/packageCartPage";
import CompletePaymentPage from "scenes/paymentPage/completePaymentPage";
import FinalCompletePaymentePage from "scenes/paymentPage/finalCompletePaymentePage";
import ActivitesPage from "scenes/acitivitiesPage";
import { useSelector } from "react-redux";
import ProductsPage from "scenes/enterprisePage/ProductsPage";
import NewProductPage from "scenes/enterprisePage/newProductPage";
import SearchPage from "scenes/searchPage";
import PackageCartFilterPage from "scenes/cartPage/packageCartFilterPage";
import ScriptsPage from "scenes/scriptsPage";
import ScriptsSecondPage from "scenes/scriptsPage/scriptsSecondPage";

function App() {

  const theme = useMemo(() => createTheme(themeSettings()), []);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/packages" element={<PackagePage />} />

            <Route path="/resultfilter" element={<SearchPage />} />

            <Route path="/scripts" element={<ScriptsPage />} />
            <Route path="/roteiro" element={<ScriptsSecondPage />} />

            <Route path="/packages/cart" element={<PackageCartPage />} />
            <Route path="/packages/cart/filter" element={<PackageCartFilterPage />} />
            <Route path="/packages/cart/checkout" element={<PaymentPage />} />
            <Route path="/packages/cart/checkout/success" element={<FinalPage />} />
            <Route path="/packages/cart/checkout/completePayment" element={<CompletePaymentPage />} />
            <Route path="/packages/cart/checkout/completePayment/success" element={<FinalCompletePaymentePage />} />

            <Route path="/profile" element={isAuth ? <ActivitesPage /> : <HomePage />} />
            <Route path="/products" element={isAuth ? <ProductsPage /> : <HomePage />} />
            <Route path="/products/newProduct" element={isAuth ? <NewProductPage /> : <HomePage />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/accommodation" element={<AccommodationPage />} />
            <Route path="/accommodation/reservation" element={<FinalPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reserveAccommodation" element={<ReserveAccommodation />} />
            <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
            <Route path="/confirmEmail" element={<ConfirmEmailPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
