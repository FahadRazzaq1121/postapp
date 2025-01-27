import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getPost,
  selectPost,
  selectTotalPost,
} from "../../../lib/redux/slices/post-slice";
import { dispatch } from "../../../lib/redux/store";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../../getAuth";
import useDebounce from "../hooks/useDebounce";
import CreatePostModal from "./CreatePostModal";
import DeleteModal from "../ui/DeleteModal";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const PostList = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
  const [page, setPage] = useState(1);
  const posts = useSelector(selectPost);
  const total = useSelector(selectTotalPost);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 500);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getPost(page, limit, search.trim()));
      } catch (error: any) {
        if (error.message.includes("Unauthorized") || !getToken()) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [debouncedSearch, page, navigate]);

  const handlePageChange = async (_event: any, value: number) => {
    setPage(value);
    await dispatch(getPost(value, limit, search));
  };

  const handleDelete = (postId: string) => {
    setDeletePostId(postId);
    setOpen(true);
  };

  const handleOpenModal = () => {
    setOpenCreatePostModal(true);
  };

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ textAlign: { xs: "center", sm: "left" } }}
        >
          Posts
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by post title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">🔍</InputAdornment>,
          }}
          sx={{
            width: { xs: "100%", sm: "50%" },
            marginBottom: { xs: 2, sm: 0 },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          sx={{
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Create Post
        </Button>
      </Box>

      <Grid container spacing={3}>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={post.image}
                  alt={post.title}
                />
                <CardContent sx={{ paddingBottom: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    noWrap
                    sx={{ mb: 0.5 }}
                  >
                    {post.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" noWrap>
                    {post.content.length > 120
                      ? `${post.content.slice(0, 120)}...`
                      : post.content}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{
                    paddingLeft: 2,
                    paddingRight: 2,
                    paddingBottom: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Author: {post.author_id.name}
                  </Typography>

                  <IconButton
                    color="error"
                    onClick={() => handleDelete(post._id)}
                    aria-label="Delete"
                    sx={{ padding: 0 }}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No posts available.
          </Typography>
        )}
      </Grid>

      <Grid container justifyContent="space-between" alignItems="center" mt={2}>
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            Showing <strong>{startIndex}</strong> - <strong>{endIndex}</strong>{" "}
            of <strong>{total}</strong> posts
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

      <CreatePostModal
        page={1}
        limit={10}
        search={search}
        setOpen={setOpenCreatePostModal}
        open={openCreatePostModal}
      />
      <DeleteModal
        id={deletePostId}
        open={open}
        setOpen={setOpen}
        component="post"
      />
    </Container>
  );
};

export default PostList;
