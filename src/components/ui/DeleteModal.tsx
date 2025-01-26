import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { getToken } from "../../../getAuth";
import { dispatch } from "../../../lib/redux/store";
import { getUser } from "../../../lib/redux/slices/user-slice";
import { useState } from "react";
import Toast from "./Toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { getPost } from "../../../lib/redux/slices/post-slice";

export default function DeleteModal({ id, open, setOpen, component }: any) {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        component === "user"
          ? `${import.meta.env.VITE_API_KEY}/user/${id}`
          : `${import.meta.env.VITE_API_KEY}/post/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (res.data.success) {
        setOpen(false);
        component === "user"
          ? await dispatch(getUser(1, 10, ""))
          : await dispatch(getPost(1, 10, ""));
        setToast({
          message: res.data.message,
          type: "success",
        });
      }
    } catch (error: any) {
      setOpen(false);
      setToast({
        message: error.response.data.message || "Error deleting",
        type: "error",
      });
    }
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Alert</DialogTitle>
          <DialogContent>
            <Box>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                Are you sure you want to delete this?
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This action cannot be reversible.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "error" })}
        />
      )}
    </>
  );
}
