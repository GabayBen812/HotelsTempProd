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
import PublicLayout from "@/components/layouts/Public/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
        handle: { documentTitle: "landing" },
      },
      {
        path: "/login",
        element: <Login />,
        handle: { documentTitle: "login" },
      },
      {
        path: "/chat",
        element: <ChatGuestPage />,
        handle: { documentTitle: "chat" },
      },
      {
        path: "/create-organization",
        element: <CreateOrganization />,
        handle: { documentTitle: "create_organization" },
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
        handle: { documentTitle: "unauthorized" },
      },
      {
        path: "/accessibility-statement",
        element: <AccessibilityStatement />,
        handle: { documentTitle: "accessibility_statement" },
      },
      {
        path: "*",
        element: <NotFoundPage />,
        handle: { documentTitle: "not_found" },
      },
    ],
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
          documentTitle: "home",
          icon: HomeIcon,
          showInSidebar: true,
        },
      },
      {
        path: "/dashboard",
        element: <Reports />,
        handle: {
          title: "dashboard",
          documentTitle: "dashboard",
          icon: ReportsIcon,
          showInSidebar: true,
        },
      },
      {
        path: "/calls",
        handle: {
          title: "calls",
          icon: CallsIcon,
          documentTitle: "calls",
          showInSidebar: true,
        },
        element: <Calls />,
      },
      {
        path: "/calls/add",
        handle: {
          documentTitle: "add_call",
        },
        element: <AddCall />,
      },
      {
        path: "/calls/:id",
        handle: {
          documentTitle: "call_details",
        },
        element: <CallDetails />,
      },
      {
        path: "/employees",
        element: <Employees />,
        handle: {
          documentTitle: "employees",
          title: "employees",
          showInSidebar: true,
          icon: PeopleIcon,
        },
      },
      {
        path: "/settings",
        handle: {
          documentTitle: "settings",
        },
        element: <Settings />,
      },
      {
        path: "/organization-settings",
        element: <OrganizationSettings />,
        handle: {
          documentTitle: "organization_settings",
          title: "organization_settings",
          showInSidebar: true,
          icon: SettingsIcon,
        },
      },
    ],
  },
]);
