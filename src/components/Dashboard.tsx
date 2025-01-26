import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button,
  Container,
  Paper,
} from "@mui/material";
import { dispatch } from "../../lib/redux/store";
import { getToken } from "../../getAuth";
import {
  getUserProfile,
  selectUserProfile,
} from "../../lib/redux/slices/userProfile-slice";
import PostList from "./post/PostList";
import UserList from "./user/UserList";
import MyProfile from "./myProfile/MyProfile";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("user");
  const navigate = useNavigate();
  const location = useLocation();
  const userProfile = useSelector(selectUserProfile);

  useEffect(() => {
    navigate(`/dashboard?tab=${activeTab}`);
  }, [activeTab, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab") || "post";
    setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getUserProfile());
      } catch (error: any) {
        if (error.message.includes("Unauthorized") || !getToken()) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const tabs = [
    { id: "post", label: "Post" },
    { id: "user", label: "Users" },
    { id: "my_profile", label: "My Profile" },
  ];

  const visibleTabs =
    userProfile?.role === "SuperAdmin"
      ? tabs
      : userProfile?.role === "Admin"
      ? tabs.filter((tab) => ["post", "user", "my_profile"].includes(tab.id))
      : userProfile?.role === "User"
      ? tabs.filter((tab) => ["post", "my_profile"].includes(tab.id))
      : [];

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Postapp
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="dashboard tabs"
          >
            {visibleTabs.map((tab) => (
              <Tab key={tab.id} label={tab.label} value={tab.id} />
            ))}
          </Tabs>
        </Paper>
        <Box>
          {activeTab === "post" && <PostList />}
          {activeTab === "user" && <UserList tab={activeTab} />}
          {activeTab === "my_profile" && <MyProfile />}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
