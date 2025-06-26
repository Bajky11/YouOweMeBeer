import { Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export const AppBar = () => {
    const pageLabel = useSelector(state => state.app.pageLabel)

    return (
        <Stack direction={"row"} alignItems={"center"} spacing={2} px={2} pt={2}>
            <Typography variant={"h5"} paddingLeft={0.5}>{pageLabel}</Typography>
        </Stack>
    )
}