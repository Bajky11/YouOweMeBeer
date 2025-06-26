import { Routes, Route, Navigate, BrowserRouter, Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./services/store";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Options } from "./pages/options/Options";
import { Home } from "./pages/home/Home";
import { AppLayout } from "./AppLayout";
import "@fontsource/inter";
import "@fontsource/inter/300.css"; // Lehký font
import "@fontsource/inter/400.css"; // Normální font
import "@fontsource/inter/700.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { LoginScreen } from "./pages/login/Login";
import { Groups } from "./pages/groups/Groups";
import { Group } from "./pages/group/Group";
import { useSelector } from "react-redux";


const theme = createTheme({
    palette: {
        primary: {
            main: "#d68f13",
            light: "#63a4ff",
            dark: "#004ba0",
            contrastText: "#fff"
        },
        secondary: {
            main: "#9c27b0",
            light: "#d05ce3",
            dark: "#6a0080",
            contrastText: "#fff"
        },
        background: {
            default: "#f5f5f5",
            paper: "#fff"
        }
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightBold: 700,
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(215, 215, 215, 0.5)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(215, 215, 215, 0.8)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(215, 215, 215, 1)",
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                }
            }
        }
    }
});

function App() {
    
    function ProtectedRoute() {
        const user = useSelector((state) => state.auth.user);
        return user ? <Outlet /> : <Navigate to="/login" replace />;
    }

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Provider store={store}>
                    <BrowserRouter basename="/youOweMeBeer">
                        <Routes>
                            <Route path="/login" element={<LoginScreen />} />
                            <Route element={<ProtectedRoute />}>
                                <Route element={<AppLayout />}>
                                    <Route path="/home" element={<Groups />} />
                                    <Route path="/options" element={<Options />} />
                                    <Route path="/group/:id" element={<Group />} />
                                </Route>
                            </Route>
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    </BrowserRouter>
                </Provider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;