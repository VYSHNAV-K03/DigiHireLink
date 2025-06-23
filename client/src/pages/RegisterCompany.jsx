import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Paper,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../data/api";

const theme = createTheme();

export default function SignUpCompany() {
  const [company, setCompany] = React.useState({
    name: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    tagline: "",
    about: "",
    logo: null,
    password: "",
    cpassword: "",
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [preview, setPreview] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompany({ ...company, logo: file });
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, logo: "" })); // Clear error if file selected
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "name":
        errorMsg =
          value.length >= 3
            ? ""
            : "Company name must be at least 3 characters long";
        break;

      case "phone":
        errorMsg = /^\d{10}$/.test(value)
          ? ""
          : "Phone number must be 10 digits";
        break;

      case "email":
        errorMsg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email format";
        break;

      case "website":
        errorMsg =
          /^(https?:\/\/)?([\w.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)
            ? ""
            : "Invalid website URL";
        break;

      case "address":
        errorMsg =
          value.length >= 5 ? "" : "Address must be at least 5 characters long";
        break;

      case "password":
        let passwordErrors = [];
        if (value.length < 8)
          passwordErrors.push("At least 8 characters required");
        if (!/[A-Z]/.test(value))
          passwordErrors.push("Include at least one uppercase letter");
        if (!/\d/.test(value))
          passwordErrors.push("Include at least one number");
        if (!/[@$!%*?&]/.test(value))
          passwordErrors.push(
            "Include at least one special character (@$!%*?&)"
          );
        errorMsg = passwordErrors.length ? passwordErrors.join(", ") : "";
        break;

      case "cpassword":
        errorMsg = value === company.password ? "" : "Passwords do not match";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const isValid = () => {
    return (
      Object.values(errors).every((error) => error === "") &&
      Object.values(company).every((value) => value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const formData = new FormData();
    Object.keys(company).forEach((key) => {
      formData.append(key, company[key]);
    });

    try {
      setLoading(true);
      await axios.post(`${apiUrl}/register-company`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setOpenModal(true); // Show modal on success
    } catch (error) {
      console.error("Error registering company:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Paper elevation={6} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
          <Typography component="h1" variant="h5" textAlign="center" mb={2}>
            Company Registration
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {[
                { label: "Company Name", name: "name" },
                { label: "Phone", name: "phone" },
                { label: "Email", name: "email" },
                { label: "Website", name: "website" },
                { label: "Address", name: "address" },
                { label: "Tagline", name: "tagline" },
                { label: "About", name: "about", multiline: true, rows: 3 },
              ].map(({ label, name, ...props }) => (
                <Grid item xs={12} sm={name === "address" ? 12 : 6} key={name}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    value={company[name]}
                    onChange={handleInput}
                    error={!!errors[name]}
                    helperText={errors[name]}
                    {...props}
                  />
                </Grid>
              ))}

              {[
                {
                  label: "Password",
                  name: "password",
                  show: showPassword,
                  toggle: togglePasswordVisibility,
                },
                {
                  label: "Confirm Password",
                  name: "cpassword",
                  show: showConfirmPassword,
                  toggle: toggleConfirmPasswordVisibility,
                },
              ].map(({ label, name, show, toggle }) => (
                <Grid item xs={12} sm={6} key={name}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    type={show ? "text" : "password"}
                    value={company[name]}
                    onChange={handleInput}
                    error={!!errors[name]}
                    helperText={errors[name]}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggle} edge="end">
                            {show ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button variant="contained" component="label" fullWidth>
                  <CloudUploadIcon sx={{ mr: 1 }} /> Upload Logo
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {errors.logo && (
                  <Typography color="error">{errors.logo}</Typography>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !isValid()}
            >
              {loading ? "Registering..." : "Sign Up"}
            </Button>
            <div className="text-center mt-3">
              <a href="/register">Sign Up as Employee</a>
            </div>
            <div className="text-center mt-3">
              <a href="/login">Already have an account? Sign In</a>
            </div>
          </Box>
        </Paper>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Registration Successful</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseModal}>OK</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
