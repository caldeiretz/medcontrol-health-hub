
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ProfileChoice from "@/pages/auth/ProfileChoice";
import PatientLogin from "@/pages/auth/PatientLogin";
import PatientRegister from "@/pages/auth/PatientRegister";
import ClinicLogin from "@/pages/auth/ClinicLogin";
import ClinicRegister from "@/pages/auth/ClinicRegister";

// Patient pages
import PatientDashboard from "@/pages/patient/Dashboard";
import PatientMedications from "@/pages/patient/Medications";
import AddMedication from "@/pages/patient/AddMedication";
import EditMedication from "@/pages/patient/EditMedication";
import PatientVitals from "@/pages/patient/Vitals";
import PatientHistory from "@/pages/patient/History";
import PatientProfile from "@/pages/patient/Profile";
import PatientAccount from "@/pages/patient/Account";
import PatientSharing from "@/pages/patient/Sharing";

// Clinic pages
import ClinicDashboard from "@/pages/clinic/Dashboard";
import ClinicPatients from "@/pages/clinic/Patients";
import ClinicPatientView from "@/pages/clinic/PatientView";
import ClinicAlerts from "@/pages/clinic/Alerts";
import ClinicAccount from "@/pages/clinic/Account";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth/profile-choice",
    element: <ProfileChoice />,
  },
  {
    path: "/auth/patient/login",
    element: <PatientLogin />,
  },
  {
    path: "/auth/patient/register",
    element: <PatientRegister />,
  },
  {
    path: "/auth/clinic/login",
    element: <ClinicLogin />,
  },
  {
    path: "/auth/clinic/register",
    element: <ClinicRegister />,
  },
  // Patient routes
  {
    path: "/patient/dashboard",
    element: <PatientDashboard />,
  },
  {
    path: "/patient/medications",
    element: <PatientMedications />,
  },
  {
    path: "/patient/medications/add",
    element: <AddMedication />,
  },
  {
    path: "/patient/medications/edit/:medicationId",
    element: <EditMedication />,
  },
  {
    path: "/patient/vitals",
    element: <PatientVitals />,
  },
  {
    path: "/patient/history",
    element: <PatientHistory />,
  },
  {
    path: "/patient/profile",
    element: <PatientProfile />,
  },
  {
    path: "/patient/account",
    element: <PatientAccount />,
  },
  {
    path: "/patient/sharing",
    element: <PatientSharing />,
  },
  // Clinic routes
  {
    path: "/clinic/dashboard",
    element: <ClinicDashboard />,
  },
  {
    path: "/clinic/patients",
    element: <ClinicPatients />,
  },
  {
    path: "/clinic/patients/:patientId",
    element: <ClinicPatientView />,
  },
  {
    path: "/clinic/alerts",
    element: <ClinicAlerts />,
  },
  {
    path: "/clinic/account",
    element: <ClinicAccount />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
