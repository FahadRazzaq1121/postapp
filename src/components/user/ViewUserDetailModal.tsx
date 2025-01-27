import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../../getAuth";
import { Modal, Box, Typography, Button } from "@mui/material";

interface PostType {
  _id: string;
  title: string;
  content: string;
  image: string;
}

interface UserInfoType {
  _id: string;
  name: string;
  email: string;
  role: string;
  posts: PostType[];
}

interface ViewUserDetailModalProps {
  userId: string | null;
  open: boolean;
  setOpen: any;
}

const ViewUserDetailModal = ({
  userId,
  open,
  setOpen,
}: ViewUserDetailModalProps) => {
  const [userDetails, setUserDetails] = useState<UserInfoType | null>(null);
  const [userPost, setUserPost] = useState<PostType[]>([]);

  useEffect(() => {
    const getUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_KEY}/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        setUserDetails(response.data.user);
        setUserPost(response.data.user.posts);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, [userId]);

  const handleClose = () => {
    setOpen(false);
  };

  if (!userDetails) {
    return;
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "60%", md: "50%" },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          User Details
        </Typography>
        <Typography variant="body1">
          <strong>Name:</strong> {userDetails.name}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {userDetails.email}
        </Typography>
        <Typography variant="body1">
          <strong>Role:</strong> {userDetails.role}
        </Typography>
        <hr />
        <Typography variant="h6">User Posts</Typography>
        {userPost && userPost.length > 0 ? (
          <div className="row g-3">
            {userPost.map((post) => (
              <div key={post._id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <img
                    src={post.image}
                    className="card-img-top"
                    alt={post.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <Typography
                      variant="body2"
                      component="h5"
                      className="text-truncate fw-bold mb-2"
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-muted text-truncate mb-3"
                    >
                      {post.content}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Typography>No posts available for this user.</Typography>
        )}
        <div className="d-flex justify-content-end mt-3">
          <Button variant="contained" color="primary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ViewUserDetailModal;
