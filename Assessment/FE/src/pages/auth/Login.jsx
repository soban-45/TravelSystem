import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    try {
      const res = await axios.post("/login/", formData);
      localStorage.setItem("token", res.data.access);
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Invalid username or password";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", alignItems: "center" }}>
      <Paper elevation={3} sx={{ padding: 4, width: "100%", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>} 

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        <Typography mt={2}>
          Don't have an account?{" "}
          <Button onClick={() => navigate("/register")} sx={{ textTransform: "none" }}>
            Register
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
