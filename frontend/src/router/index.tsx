import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginSkeleton, PageSkeleton } from "@/components/ui/skeleton";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const AppLayout = lazy(() => import("@/components/layout/AppLayout"));
const Login = lazy(() => import("@/pages/Login"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Patients = lazy(() => import("@/pages/Patients"));
const PatientProfile = lazy(() => import("@/pages/PatientProfile"));
const Appointments = lazy(() => import("@/pages/Appointments"));
const Consultations = lazy(() => import("@/pages/Consultations"));
const ConsultationReport = lazy(() => import("@/pages/ConsultationReport"));
const UsersPage = lazy(() => import("@/pages/Users"));
const Profile = lazy(() => import("@/pages/Profile"));

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page pública / para Clientes (consulta por folio, sin dashboard) */}
        <Route
          path="/portal"
          element={
            <Suspense fallback={<PageSkeleton />}>
              <LandingPage />
            </Suspense>
          }
        />

        <Route
          path="/login"
          element={
            <Suspense fallback={<LoginSkeleton />}>
              <Login />
            </Suspense>
          }
        />

        {/* Rutas internas de gestión exclusivas para ADMIN y VETERINARIO */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "VETERINARIO"]} />}>
          <Route
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AppLayout />
              </Suspense>
            }
          >
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="/patients"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <Patients />
                </Suspense>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <PatientProfile />
                </Suspense>
              }
            />
            <Route
              path="/citas"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <Appointments />
                </Suspense>
              }
            />
            <Route
              path="/consultas"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <Consultations />
                </Suspense>
              }
            />
            <Route
              path="/consultas/:id"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <ConsultationReport />
                </Suspense>
              }
            />
            <Route
              path="/perfil"
              element={
                <Suspense fallback={<PageSkeleton />}>
                  <Profile />
                </Suspense>
              }
            />

            {/* Ruta exclusiva para Administrador */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route
                path="/usuarios"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <UsersPage />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/portal" replace />} />
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
