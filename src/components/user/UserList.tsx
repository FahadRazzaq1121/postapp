import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Pagination,
} from "@mui/material";
import { Edit, Eye, Trash } from "lucide-react";
import CreateUserModal from "../ui/CreateUserModal";
import ViewUserDetailModal from "./ViewUserDetailModal";
import { useSelector } from "react-redux";
import {
  getUser,
  selectTotalUser,
  selectUser,
} from "../../../lib/redux/slices/user-slice";
import { selectUserProfile } from "../../../lib/redux/slices/userProfile-slice";
import { dispatch } from "../../../lib/redux/store";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../getAuth";
import useDebounce from "../hooks/useDebounce";
import DeleteModal from "../ui/DeleteModal";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UserList = ({ tab }: any) => {
  const userProfile = useSelector(selectUserProfile);
  const userArray = useSelector(selectUser);
  const total = useSelector(selectTotalUser);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 500);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = async (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    try {
      await dispatch(getUser(value, limit, search));
    } catch (error: any) {
      if (error.message.includes("Unauthorized") || !getToken()) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(getUser(page, limit, search.trim()));
      } catch (error: any) {
        if (error.message.includes("Unauthorized") || !getToken()) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      }
    };

    fetchUsers();
  }, [debouncedSearch, dispatch, navigate, page]);

  const handleViewClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsViewDetailsOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setDeleteUser(userId);
    setOpen(true);
  };

  const handleCreateUser = () => {
    setOpenCreateModal(true);
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUserId(user._id);
    setOpenCreateModal(true);
  };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Users</Typography>
        <TextField
          size="small"
          placeholder="Search by email"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">🔍</InputAdornment>,
          }}
        />
        {userProfile?.role !== "User" && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateUser}
          >
            Create User
          </Button>
        )}
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userArray.map((user: UserType) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewClick(user._id)}
                  >
                    <Eye color="blue" />
                  </IconButton>
                  {userProfile?.role === "SuperAdmin" && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user._id)}
                        aria-label="Delete"
                      >
                        <Trash color="red" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container justifyContent="space-between" alignItems="center" mt={2}>
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            Showing <strong>{startIndex}</strong> - <strong>{endIndex}</strong>{" "}
            of <strong>{total}</strong> users
          </Typography>
        </Grid>
        <Grid item>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Grid>
      </Grid>

      <CreateUserModal
        tab={tab}
        page={page}
        limit={limit.toString()}
        search={search}
        setOpen={setOpenCreateModal}
        open={openCreateModal}
        user={userArray.find((u) => u._id === selectedUserId) || null}
      />
      <ViewUserDetailModal
        userId={selectedUserId}
        open={isViewDetailsOpen}
        setOpen={setIsViewDetailsOpen}
      />
      <DeleteModal
        id={deleteUser}
        open={open}
        setOpen={setOpen}
        component="user"
      />
    </Box>
  );
};

export default UserList;
