import { useSelector } from "react-redux";
import { selectUserProfile } from "../../../lib/redux/slices/userProfile-slice";
import { Box, Card, CardHeader, CardContent, Typography, List, ListItem, ListItemText, CircularProgress } from "@mui/material";

const MyProfile = () => {
  const user = useSelector(selectUserProfile);

  return (
    <Box
      sx={{
        mt: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 600, boxShadow: 3 }}>
        <CardHeader
          title="My Profile"
          titleTypographyProps={{
            variant: "h5",
            textAlign: "center",
            color: "white",
          }}
          sx={{ backgroundColor: "#add8e6" }}
        />
        <CardContent>
          {user ? (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                User Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="ID" secondary={user._id} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Name" secondary={user.name} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Role" secondary={user.role} />
                </ListItem>
              </List>
            </>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MyProfile;
