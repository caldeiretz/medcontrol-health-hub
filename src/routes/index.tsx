
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Landing page
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Auth pages
const ProfileChoice = lazy(() => import('@/pages/auth/ProfileChoice'));
const PatientLogin = lazy(() => import('@/pages/auth/PatientLogin'));
const PatientRegister = lazy(() => import('@/pages/auth/PatientRegister'));
const ClinicLogin = lazy(() => import('@/pages/auth/ClinicLogin'));
const ClinicRegister = lazy(() => import('@/pages/auth/ClinicRegister'));

// Patient pages
const PatientDashboard = lazy(() => import('@/pages/patient/Dashboard'));
const PatientMedications = lazy(() => import('@/pages/patient/Medications'));
const PatientAddMedication = lazy(() => import('@/pages/patient/AddMedication'));
const PatientEditMedication = lazy(() => import('@/pages/patient/EditMedication'));
const PatientVitals = lazy(() => import('@/pages/patient/Vitals'));
const PatientHistory = lazy(() => import('@/pages/patient/History'));
const PatientSharing = lazy(() => import('@/pages/patient/Sharing'));
const PatientProfile = lazy(() => import('@/pages/patient/Profile'));

// Clinic pages
const ClinicDashboard = lazy(() => import('@/pages/clinic/Dashboard'));
const ClinicPatientView = lazy(() => import('@/pages/clinic/PatientView'));
const ClinicPatients = lazy(() => import('@/pages/clinic/Patients'));
const ClinicAlerts = lazy(() => import('@/pages/clinic/Alerts'));
const ClinicSettings = lazy(() => import('@/pages/clinic/Settings'));
const ClinicAccount = lazy(() => import('@/pages/clinic/Account'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

// Enhanced Auth guard with comprehensive security checks
const AuthGuard = ({ children, userType }: { children: JSX.Element, userType: 'patient' | 'clinic' }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Primary authentication check
  if (!isAuthenticated || !user) {
    console.log('Access denied: User not authenticated');
    return <Navigate to="/auth/profile-choice" replace />;
  }
  
  // Validate user role matches required type
  if (user.role !== userType) {
    console.log(`Access denied: User role ${user.role} does not match required ${userType}`);
    return <Navigate to={user.role === 'patient' ? '/patient/dashboard' : '/clinic/dashboard'} replace />;
  }
  
  // Additional security checks for valid user data
  if (!user.id || !user.email) {
    console.log('Access denied: Invalid user data detected');
    return <Navigate to="/auth/profile-choice" replace />;
  }

  // Check for valid session token
  const authToken = sessionStorage.getItem('authToken');
  if (!authToken) {
    console.log('Access denied: No valid session token');
    return <Navigate to="/auth/profile-choice" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth/profile-choice" element={<ProfileChoice />} />
        <Route path="/auth/patient-login" element={<PatientLogin />} />
        <Route path="/auth/patient-register" element={<PatientRegister />} />
        <Route path="/auth/clinic-login" element={<ClinicLogin />} />
        <Route path="/auth/clinic-register" element={<ClinicRegister />} />

        {/* Patient protected routes */}
        <Route 
          path="/patient/dashboard" 
          element={
            <AuthGuard userType="patient">
              <PatientDashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/patient/medications" 
          element={
            <AuthGuard userType="patient">
              <PatientMedications />
            </AuthGuard>
          } 
        />
        <Route 
          path="/patient/add-medication" 
          element={
            <AuthGuard userType="patient">
              <PatientAddMedication />
            </AuthGuard>
          } 
        />
        <Route 
          path="/patient/edit-medication/:medicationId" 
          element={
            <AuthGuard userType="patient">
              <PatientEditMedication />
            </AuthGuard>
          } 
        />
        <Route 
          path="/patient/vitals" 
          element={
            <AuthGuard userType="patient">
              <PatientVitals />
            </AuthGuard>
          } 
        />
        <Route 
          path="/patient/history" 
          element={
            <AuthGuard userType="patient">
              <PatientHistory />
            </AuthGuard>
          } 
        />
        <Route 
          path="/patient/sharing" 
          element={
            <AuthGuard userType="patient">
              <PatientSharing />
            </AuthGuard>
          } 
        />
        <Route 
          path="/patient/profile" 
          element={
            <AuthGuard userType="patient">
              <PatientProfile />
            </AuthGuard>
          } 
        />

        {/* Clinic protected routes */}
        <Route 
          path="/clinic/dashboard" 
          element={
            <AuthGuard userType="clinic">
              <ClinicDashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/clinic/patients" 
          element={
            <AuthGuard userType="clinic">
              <ClinicPatients />
            </AuthGuard>
          } 
        />
        <Route 
          path="/clinic/alerts" 
          element={
            <AuthGuard userType="clinic">
              <ClinicAlerts />
            </AuthGuard>
          } 
        />
        <Route 
          path="/clinic/settings" 
          element={
            <AuthGuard userType="clinic">
              <ClinicSettings />
            </AuthGuard>
          } 
        />
        <Route 
          path="/clinic/account" 
          element={
            <AuthGuard userType="clinic">
              <ClinicAccount />
            </AuthGuard>
          } 
        />
        <Route 
          path="/clinic/patient/:patientId" 
          element={
            <AuthGuard userType="clinic">
              <ClinicPatientView />
            </AuthGuard>
          } 
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
