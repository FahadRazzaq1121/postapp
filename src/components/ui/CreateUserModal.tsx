import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../../lib/redux/slices/userProfile-slice";
import axios from "axios";
import { getToken } from "../../../getAuth";
import { useEffect, useState } from "react";
import Toast from "./Toast";
import { useNavigate } from "react-router-dom";
import { dispatch } from "../../../lib/redux/store";
import { getUser } from "../../../lib/redux/slices/user-slice";
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Grid,
} from "@mui/material";

interface UserFormData {
  email: string;
  password: string;
  name: string;
  role: string;
}

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number"),
    role: yup.string().required("Role is required"),
  })
  .required();

const CreateUserModal = ({
  open,
  setOpen,
  page,
  limit,
  search,
  user,
}: any) => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });

  const navigate = useNavigate();
  const userProfile = useSelector(selectUserProfile);
  const onClose = () => setOpen(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    defaultValues: user || { name: "", email: "", password: "", role: "" },
  });

  useEffect(() => {
    if (user) {
      Object.keys(user).forEach((key) =>
        setValue(key as keyof UserFormData, user[key])
      );
    }
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const url = user
        ? `${import.meta.env.VITE_API_KEY}/user/${user._id}`
        : `${import.meta.env.VITE_API_KEY}/user`;
      const method = user ? "put" : "post";
      const res = await axios[method](url, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${getToken()}`,
        },
      });
      if (res.data.success) {
        reset();
        await dispatch(getUser(page, limit, search));
        setToast({
          message: user
            ? "User updated successfully"
            : "New user created successfully",
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

  const roleOptions: { [key: string]: string[] } = {
    SuperAdmin: ["SuperAdmin", "Admin", "User"],
    Admin: ["User"],
    User: [],
  };

  const options =
    userProfile?.role && roleOptions[userProfile.role]
      ? roleOptions[userProfile.role]
      : [];

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 600,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2" gutterBottom>
            {user ? "Update User" : "Create User"}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  fullWidth
                  label="Name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  {...register("role")}
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  defaultValue="" 
                >
                  <MenuItem value="">Select Role</MenuItem>
                  {options.map((role: string) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  fullWidth
                  label="Email"
                  disabled={user ? true : false}
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  type="password"
                  fullWidth
                  label="Password"
                  disabled={user ? true : false}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Your password must have:
                </Typography>
                <ul>
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                </ul>
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" type="submit">
                  {user ? "Update User" : "Create User"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "error" })}
        />
      )}
    </>
  );
};

export default CreateUserModal;
