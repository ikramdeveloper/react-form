import { Routes, Route } from "react-router-dom";
import {
  Layout,
  Login,
  Register,
  Home,
  Editor,
  Admin,
  LinkPage,
  Missing,
  Lounge,
  Unauthorized,
  RequireAuth,
} from "./components";

const ROLES = {
  User: 2022,
  Editor: 1857,
  Admin: 1497,
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* private routes */}
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.User, ROLES.Admin, ROLES.Editor]}
            />
          }
        >
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
          <Route path="editor" element={<Editor />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route
          element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}
        >
          <Route path="lounge" element={<Lounge />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
};

export default App;
