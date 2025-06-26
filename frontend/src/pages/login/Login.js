import { Stack, Typography } from "@mui/material"
import { TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetUserByUsernameQuery } from "../../services/api/user/userApi";
import { setUser } from "../../services/slice/auth/authSlice";
import useForm from "../../common/hooks/useForm";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

export const LoginScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { formData, handleChange, resetForm } = useForm({ username: "" });
    const [loginError, setLoginError] = useState(null);
    const [triggered, setTriggered] = useState(false);
    const [usernameToCheck, setUsernameToCheck] = useState("");
    const { data: userByUsername, isLoading: userByUsernameLoading, error: userByUsernameError } = useGetUserByUsernameQuery(usernameToCheck, { skip: !triggered });

    // Kontrola cookies při prvotním načtení
    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            try {
                const user = JSON.parse(userCookie);
                dispatch(setUser(user));
                navigate("/home");
            } catch (e) {
                Cookies.remove('user');
            }
        }
    }, [dispatch, navigate]);

    const handleLogin = async () => {
        setLoginError(null);
        if (!formData.username) {
            setLoginError("Zadejte uživatelské jméno");
            return;
        }
        setTriggered(true);
        setUsernameToCheck(formData.username);
    };

    // Pokud dotaz doběhl a byl spuštěn, řešíme výsledek
    useEffect(() => {
        if (triggered && !userByUsernameLoading) {
            if (userByUsername) {
                dispatch(setUser(userByUsername));
                Cookies.set('user', JSON.stringify(userByUsername), { path: '/' });
                navigate("/home");
            } else if (userByUsernameError) {
                if (!loginError) setLoginError("Uživatel nenalezen");
            }
        }
        // eslint-disable-next-line
    }, [triggered, userByUsernameLoading, userByUsername, userByUsernameError]);

    return (
        <div
            style={{
                minHeight: "100vh",
                minWidth: "100vw",
                backgroundImage: `url(${process.env.PUBLIC_URL || ""}/beer_background.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Stack spacing={12} justifyContent={"center"} padding={2} height="100vh">
                <Stack spacing={3} elevation={3} padding={4} bgcolor="background.paper" borderRadius={2} boxShadow={3}>
                    <Typography variant="h4">
                        Koho dnes pozveš na pivko?
                    </Typography>
                    <TextField
                        label="Přihlašovací jméno"
                        variant="outlined"
                        fullWidth
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {userByUsernameLoading && triggered && (
                        <Typography color="textSecondary">Načítání uživatele podle username...</Typography>
                    )}
                    {loginError && <Typography color="error">{loginError}</Typography>}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLogin}
                        disabled={userByUsernameLoading}
                    >
                        Přihlásit / Registrovat 
                    </Button>
                </Stack>
            </Stack>
        </div>
    );
}