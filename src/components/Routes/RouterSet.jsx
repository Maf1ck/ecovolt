import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const MainPage = lazy(() => import("../../pages/Main/Main.jsx"));
const AboutUsPage = lazy(() => import("../../pages/AboutUsPage/AboutUsPage.jsx"));
const InfoDeliveryPage = lazy(() => import("../../pages/InfoDeliveryPage/InfoDeliveryPage.jsx"));
const ReviewsPage = lazy(() => import("../../pages/ReviewsPage/ReviewsPage.jsx"));
const TransportationInfoPage = lazy(() => import("../../pages/TransportationInfoPage/TransportationInfoPage.jsx"));

    const RouterSet = () => {
    return (
        <Suspense fallback={<div>Завантаження...</div>}>
        <Routes>
            <Route index element={<MainPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="info-delivery" element={<InfoDeliveryPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="transportation-info" element={<TransportationInfoPage />} />
            {/* Тут можна додати решту сторінок */}
        </Routes>
        </Suspense>
    );
    };

    export default RouterSet;
