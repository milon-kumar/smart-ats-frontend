import { createBrowserRouter } from "react-router";

import PublicLayout from "@/layouts/PublicLayout";
import RecruiterLayout from "@/layouts/RecruiterLayout";

import ProtectedRoute from "@/routes/ProtectedRoute";
import GuestRoute from "@/routes/GuestRoute";

import JobList from "@/pages/public/JobList";
import JobDetails from "@/pages/public/JobDetails";
import NotFound from "@/pages/public/NotFound";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import ApplyJob from "@/pages/candidate/ApplyJob";
import MyApplications from "@/pages/candidate/MyApplications";
import ApplicationDetail from "@/pages/candidate/ApplicationDetail";

import Dashboard from "@/pages/recruiter/Dashboard";
import MyJobPosts from "@/pages/recruiter/MyJobPosts";
import JobPostForm from "@/pages/recruiter/JobPostForm";
import Applicants from "@/pages/recruiter/Applicants";
import ApplicantDetail from "@/pages/recruiter/ApplicantDetail";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <JobList />,
      },
      {
        path: "jobs/:id",
        element: <JobDetails />,
      },
      {
        element: <ProtectedRoute role="candidate" />,
        children: [
          {
            path: "jobs/:id/apply",
            element: <ApplyJob />,
          },
          {
            path: "my-applications",
            element: <MyApplications />,
          },
          {
            path: "my-applications/:id",
            element: <ApplicationDetail />,
          },
        ],
      },
    ],
  },

  {
    element: <GuestRoute />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  {
    path: "recruiter",
    element: (
      <ProtectedRoute role="recruiter">
        <RecruiterLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "jobs",
        element: <MyJobPosts />,
      },
      {
        path: "jobs/new",
        element: <JobPostForm />,
      },
      {
        path: "jobs/:id/edit",
        element: <JobPostForm />,
      },
      {
        path: "jobs/:id/applicants",
        element: <Applicants />,
      },
      {
        path: "applications/:id",
        element: <ApplicantDetail />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);