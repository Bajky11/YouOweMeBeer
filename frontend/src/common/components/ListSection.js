import { List, Stack, Typography } from "@mui/material"

export const ListSection = ({ title, children }) => {
    return <Stack spacing={0.5}>
        <Typography variant="h6" paddingLeft={0.5}>{title}</Typography>
        <List sx={{ borderRadius: 2, backgroundColor: "#fafafa", border: "1px solid #f5f5f5" }} disablePadding >
            {children}
        </List>
    </Stack>
}
