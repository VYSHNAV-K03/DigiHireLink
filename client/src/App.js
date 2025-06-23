import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Register";
import Profilepage from "./pages/Profilepage";
import Logout from "./pages/Logout";
import Profilepage_admin_want from "./pages/Profilepage_admin_want";
import Form from "./pages/Form";
import Landing from "./pages/Landing";
import Notification from "./pages/Notification";
import Notification_each from "./components/Notification_each";
import Chat from "./pages/Chat";
import PostJob from "./pages/PostJob";
import ApplicationsPage from "./pages/JobApplications";
import SignUpCompany from "./pages/RegisterCompany";
import HomeCheck from "./pages/HomeCheck";
import ProjectManager from "./pages/ProjectManager";
import Profilepage_Project from "./pages/Profilepage_project";
import CompanyResignations from "./pages/CompanyResignations";
import Profilepage_emp_want from "./pages/Profilepage_empwant";
import AiTools from "./pages/AiTools";
import AiContent from "./pages/AiContent";
import AiImage from "./pages/AiImage";
import SeoContentGenerator from "./pages/SeoContentGenerator";
import EmailMarketing from "./pages/EmailMarketing";
import Chatbot from "./pages/Chatbot";
import SocialMedia from "./pages/SocialMedia";
import AdminPanel from "./pages/AdminPanel";
import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<HomeCheck />} />
        <Route path="/recruiter" exact element={<Home />} />
        <Route path="/admin" exact element={<AdminPanel />} />
        <Route path="/projectmanager" exact element={<ProjectManager />} />

        <Route path="/ai" exact element={<AiTools />} />
        <Route path="/ai/content" exact element={<AiContent />} />
        <Route path="/ai/img" exact element={<AiImage />} />
        <Route path="/ai/seo" exact element={<SeoContentGenerator />} />
        <Route path="/ai/email" exact element={<EmailMarketing />} />
        <Route path="/ai/chat" exact element={<Chatbot />} />
        <Route path="/ai/social" exact element={<SocialMedia />} />

        <Route path="/landing" exact element={<Landing />} />
        <Route path="/login" exact element={<SignIn />} />
        <Route path="/register" exact element={<SignUp />} />
        <Route path="/register_company" exact element={<SignUpCompany />} />

        <Route path="/logout" exact element={<Logout />} />
        <Route path="/applications" exact element={<ApplicationsPage />} />

        <Route path="/infoform" exact element={<Form />} />

        <Route path="/profile" exact element={<Profilepage />} />
        <Route
          path="/profile_admin_want"
          exact
          element={<Profilepage_admin_want />}
        />
        <Route
          path="/profile_emp_want"
          exact
          element={<Profilepage_emp_want />}
        />
        <Route path="/profile_project" element={<Profilepage_Project />} />
        <Route path="/notification" exact element={<Notification />} />
        <Route
          path="/notification_each"
          exact
          element={<Notification_each />}
        />
        {/* <Route path="/chat" exact element={<Chat />} /> */}

        <Route path="/postjob" exact element={<PostJob />} />

        <Route path="/resignations" exact element={<CompanyResignations />} />
      </Routes>
      <ChatWidget />

    </>
  );
}

export default App;
