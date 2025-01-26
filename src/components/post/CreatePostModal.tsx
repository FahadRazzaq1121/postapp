import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Image } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import axios from "axios";
import Toast from "../ui/Toast";
import { getToken } from "../../../getAuth";
import { useNavigate } from "react-router-dom";
import { dispatch } from "../../../lib/redux/store";
import { getPost } from "../../../lib/redux/slices/post-slice";

interface PostFormData {
  title: string;
  content?: string;
  image: File | null;
}

const CreatePostModal = ({ open, setOpen, page, limit, search }: any) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const onClose = () => setOpen(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PostFormData>({});

  const onSubmit = async (data: PostFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content || "");
      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_KEY}/post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (res.data.success) {
        reset();
        setValue("image", null);
        setPreviewImage(null);
        await dispatch(getPost(page, limit, search));
        setToast({
          message: res.data.message,
          type: "success",
        });
        onClose();
      }
    } catch (error: any) {
      if (error.message.includes("Unauthorized") || !getToken()) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setValue("image", file);
    }
  };

  const handleCircleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Post</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          ={" "}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            marginBottom={2}
          >
            <Box
              onClick={handleCircleClick}
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={150}
              height={150}
              borderRadius="50%"
              overflow="hidden"
              border="2px solid #ddd"
              sx={{ cursor: "pointer", position: "relative" }}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <IconButton>
                  <Image size={40} />
                </IconButton>
              )}
            </Box>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              name="image"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Box>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={5}
            {...register("content")}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          Create Post
        </Button>
      </DialogActions>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "error" })}
        />
      )}
    </Dialog>
  );
};

export default CreatePostModal;
