import { Route, Routes } from "react-router"; // Correct import
import Signin from "./pages/Signin";
import AdminLayout from "./pages/Admin/AdminLayout";
import Home from "./pages/Admin/components/Home";
import RegisterEmployers from "./pages/Admin/components/RegisterEmployers";
import Alluser from "./pages/Admin/components/Alluser";
import AllEmployers from "./pages/Admin/components/AllEmployers";
import Analyst from "./pages/Admin/components/Analyst";
import EmployeLayout from "./pages/Employers/EmployeLayout";
import RegisterCompony from "./pages/Employers/components/RegisterCompony";
import JobCreated from "./pages/Employers/components/JobCreated";
import ApplicationsUser from "./pages/Employers/components/ApplicationsUser";
import UserLayout from "./pages/Users/UserLayout";
import AllJobs from "./pages/Users/components/AllJobs";
import ProfileCreate from "./pages/Users/components/ProfileCreate";
import ApplicationResponse from "./pages/Users/components/ApplicationResponse";
import Notification from "./pages/Users/components/Notification";


function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signin />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Home />} /> 
          <Route path="home" element={<Home />} /> 
          <Route path="newregister" element={<RegisterEmployers />} /> 
          <Route path="users" element={<Alluser />} />
          <Route path="employe" element={<AllEmployers />} /> 
          <Route path="analyst" element={<Analyst />} /> 
        </Route>

        {/* Employer Routes */}
        <Route path="/employer" element={<EmployeLayout />}>
          <Route path="register" element={<RegisterCompony />} /> 
          <Route path="createjob" element={<JobCreated />} /> 
          <Route path="application" element={<ApplicationsUser />} /> 


        </Route>
        <Route path="/user" element={<UserLayout />}>
        <Route path="alljobs" element={<AllJobs />}></Route>
        <Route path="applications" element={<ApplicationResponse />}></Route>
        <Route path="profile" element={<ProfileCreate />}></Route>
        <Route path="notification" element={<Notification />}></Route>

        </Route>
      </Routes>
    </>
  );
}

export default App;