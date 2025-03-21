import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../../api/auth";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    try {
      const userRole = formData.isAdmin ? "admin" : "user";
      await axios.post("/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: userRole,
      });
      navigate("/");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error?.username?.[0] ||
        error.response?.data?.error?.email?.[0] ||
        error.response?.data?.error?.password?.[0] ||
        "Registration failed. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", alignItems: "center" }}>
      <Paper elevation={3} sx={{ padding: 4, width: "100%", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Register
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
            label="Email"
            name="email"
            type="email"
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
          <FormControlLabel
            control={<Checkbox name="isAdmin" color="primary" onChange={handleChange} />}
            label="Register as Admin"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
        <Typography mt={2}>
          Already have an account?{" "}
          <Button onClick={() => navigate("/")} sx={{ textTransform: "none" }}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;
