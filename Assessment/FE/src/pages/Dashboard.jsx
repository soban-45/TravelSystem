import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Modal,
    Box,
    TextField,
    Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
    fetchRequests,
    updateStatus,
    submitTravelRequest,
    getUserRole,
    getUserIdFromToken,
} from "../api/api";

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [newTrip, setNewTrip] = useState({
        from_place: "",
        to_place: "",
        reason: "",
        start_date: null,
        end_date: null,
    });

    useEffect(() => {
        loadRequests();
        setIsAdmin(getUserRole());
    }, []);

    const loadRequests = async () => {
        const data = await fetchRequests();
        setRequests(data);
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleInputChange = (e) => {
        setNewTrip({ ...newTrip, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            console.error("User ID not found");
            return;
        }

        const tripData = {
            ...newTrip,
            start_date: newTrip.start_date ? dayjs(newTrip.start_date).format("YYYY-MM-DD") : null,
            end_date: newTrip.end_date ? dayjs(newTrip.end_date).format("YYYY-MM-DD") : null,
            applied_at: new Date().toISOString(),
            status: "pending",
            user: userId,
        };

        await submitTravelRequest(tripData);

        setNewTrip({
            from_place: "",
            to_place: "",
            reason: "",
            start_date: null,
            end_date: null,
        });

        handleCloseModal();
        loadRequests();
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Travel Requests
            </Typography>

            <Button variant="contained" color="primary" sx={{ float: "right", mb: 2 }} onClick={handleOpenModal}>
                Make Trip
            </Button>

            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>From</b></TableCell>
                            <TableCell><b>To</b></TableCell>
                            <TableCell><b>Reason</b></TableCell>
                            <TableCell><b>Start Date</b></TableCell>
                            <TableCell><b>End Date</b></TableCell>
                            <TableCell><b>Applied At</b></TableCell>
                            {!isAdmin && <TableCell><b>Status</b></TableCell>}
                            {isAdmin && <TableCell><b>User</b></TableCell>}
                            {isAdmin && <TableCell><b>Actions</b></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell>{req.from_place}</TableCell>
                                <TableCell>{req.to_place}</TableCell>
                                <TableCell>{req.reason}</TableCell>
                                <TableCell>{req.start_date}</TableCell>
                                <TableCell>{req.end_date}</TableCell>
                                <TableCell>{new Date(req.applied_at).toLocaleString()}</TableCell>
                                {!isAdmin && (
                                    <TableCell style={{ color: req.status === "approved" ? "green" : req.status === "rejected" ? "red" : "orange" }}>
                                        {req.status}
                                    </TableCell>
                                )}
                                {isAdmin && <TableCell>{req.user ? `User ${req.user}` : "N/A"}</TableCell>}
                                {isAdmin && (
                                    <TableCell>
                                        {req.status === "pending" ? (
                                            <Box sx={{ display: "flex", gap: 1 }}>
                                                <Button variant="contained" color="success" onClick={() => updateStatus(req.id, "approved").then(loadRequests)}>
                                                    Approve
                                                </Button>
                                                <Button variant="contained" color="error" onClick={() => updateStatus(req.id, "rejected").then(loadRequests)}>
                                                    Reject
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontWeight: "bold", color: req.status === "approved" ? "green" : "red" }}>
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </Typography>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 450,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" mb={2}>Create Travel Request</Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField fullWidth label="From Place" name="from_place" value={newTrip.from_place} onChange={handleInputChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="To Place" name="to_place" value={newTrip.to_place} onChange={handleInputChange} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth label="Reason" name="reason" value={newTrip.reason} onChange={handleInputChange} multiline rows={2} />
                        </Grid>

                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Start Date"
                                    value={newTrip.start_date}
                                    onChange={(date) => setNewTrip({ ...newTrip, start_date: date })}
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="End Date"
                                    value={newTrip.end_date}
                                    onChange={(date) => setNewTrip({ ...newTrip, end_date: date || null })}
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>

                    <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 2, width: "100%" }}>
                        Submit
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default Dashboard;
