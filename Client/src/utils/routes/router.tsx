// router.js
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "@/api/PrivateRoute";
import CreateOrganization from "@/pages/CreateOrganization/CreateOrganization";
import Login from "@/pages/Login/Login";
import { Layout } from "@/components/layouts/Layout";
import HomeIcon from "@/assets/icons/HomeIcon";
import ReportsIcon from "@/assets/icons/ReportsIcon";
import CallsIcon from "@/assets/icons/CallsIcon";
import PeopleIcon from "@/assets/icons/PeopleIcon";
import Settings from "@/pages/Settings/Settings";
import Employees from "@/pages/Employees";
import OrganizationSettings from "@/pages/OrganizationSettings";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import Calls from "@/pages/Calls";
import Reports from "@/pages/Reports";
import ChatbotLauncher from "@/components/aiAgent/ChatBotLauncher";
import Home from "@/pages/Home";
import ChatGuestPage from "@/pages/Guest";
import AddCall from "@/pages/Calls/AddCall";
import CallDetails from "@/pages/Calls/CallDetails";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";
import NotFoundPage from "@/pages/errors/NotFoundPage";
import Homepage from "@/pages/HomePage";
import AccessibilityLauncher from "@/components/accessibility/AccessibilityLauncher";
import AccessibilityStatement from "@/pages/AccessibilityStatement/AccessibilityStatement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    handle: { showInSidebar: false },
  },
  {
    path: "/",
    element: (
      <Layout>
        <PrivateRoute />
        <AccessibilityLauncher />
        <ChatbotLauncher />
      </Layout>
    ),
    handle: { showInSidebar: true },
    children: [
      {
        path: "/home",
        element: <Home />,
        handle: {
          title: "home",
          icon: HomeIcon,
          showInSidebar: true,
        },
      },
      {
        path: "/dashboard",
        element: <Reports />,
        handle: {
          title: "dashboard",
          icon: ReportsIcon,
          showInSidebar: true,
        },
      },
      {
        path: "/calls",
        handle: {
          title: "calls",
          icon: CallsIcon,
          showInSidebar: true,
        },
        element: <Calls />,
      },
      {
        path: "/calls/add",
        element: <AddCall />,
      },
      {
        path: "/calls/:id",
        element: <CallDetails />,
      },
      {
        path: "/employees",
        element: <Employees />,
        handle: { title: "employees", showInSidebar: true, icon: PeopleIcon },
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/organization-settings",
        element: <OrganizationSettings />,
        handle: {
          title: "organization_settings",
          showInSidebar: true,
          icon: SettingsIcon,
        },
      },
    ],
  },
  { path: "/create-organization", element: <CreateOrganization /> },
  { path: "/login", element: <Login /> },
  {
    path: "/chat",
    element: <ChatGuestPage />,
  },
  { path: "/accessibility-statement", element: <AccessibilityStatement /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
