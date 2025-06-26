import {IconButton, Stack, Typography} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {Group, Home, Login, Menu, Settings} from "@mui/icons-material";
import { LoginScreen } from "../pages/login/Login";

export const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Stack borderTop={"1px solid rgba(246,246,246,1)"} direction={"row"} justifyContent={"space-evenly"} p={0.5}>
            <BottomNavigationItem
                onClick={() => navigate("/home")}
                selected={location.pathname === "/home"}
                label={"Groups"}
                Icon={<Group/>}
            />
            <BottomNavigationItem
                onClick={() => navigate("/options")}
                selected={location.pathname === "/options"}
                label={"Settings"}
                Icon={<Settings/>}
            />
        </Stack>
    )
}

export const BottomNavigationItem = ({onClick, selected, label, Icon}) => {

    return (
        <Stack alignItems={"center"} spacing={-1}>
            <IconButton size={"large"} onClick={onClick} sx={{color: selected ? "orange" : "#49454F"}}>
                {Icon}
            </IconButton>
            <Typography fontSize={12}>{label}</Typography>
        </Stack>
    )
}