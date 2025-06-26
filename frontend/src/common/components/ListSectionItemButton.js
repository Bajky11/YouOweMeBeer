import { Delete, DeleteOutline, DeleteOutlineTwoTone, Remove } from "@mui/icons-material";
import { Box, IconButton, ListItem, ListItemButton, Stack, Typography } from "@mui/material";

export const ListSectionItemButton = ({ label, helperText, variant, Icon, onClick, onRemove }) => {

    function styleButtonByVariant(variant) {
        switch (variant) {
            case "top":
                return {
                    paddingY: 1.5,
                    borderTopLeftRadius: 7, borderTopRightRadius: 7
                };
            case "middle":
                return {
                    paddingY: 1.5,

                };
            case "bottom":
                return {
                    paddingY: 1.5,
                    borderBottomLeftRadius: 7,
                    borderBottomRightRadius: 7,
                };
            case "single":
                return {
                    paddingY: 1.5,
                    borderBottomLeftRadius: 7,
                    borderBottomRightRadius: 7,
                    borderTopLeftRadius: 7, borderTopRightRadius: 7
                };

        }
    }

    function styleButtonByActionPresent() {
        if (onRemove) {
            return {
                justifyContent: "space-between",
                backgroundColor: "rgb(84, 84, 84)",
                flex: 1
            }
        }
        return null
    }

    const handleOnRemove = (e) => {
        e.stopPropagation();
        if (onRemove) {
            onRemove();
        }
    }

    return <ListItem disablePadding divider={variant !== "bottom" && variant !== "single"}>
        <ListItemButton
            onClick={onClick || null}
            sx={{
                ...styleButtonByVariant(variant)
            }}
        >
            <Stack direction={"row"} spacing={2} alignItems={"center"} justifyContent={"space-between"} flex={1} >
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    {Icon ? Icon : null}
                    <Stack>
                        <Typography>{label}</Typography>
                        {helperText && <Typography variant="body2" color="textSecondary">{helperText}</Typography>}
                    </Stack>
                </Stack>
                {
                    onRemove ? (
                        <IconButton onClick={handleOnRemove} size={"small"} sx={{ color: "darkred" }}>
                            <DeleteOutline />
                        </IconButton>
                    ) : null
                }
            </Stack>
        </ListItemButton>
    </ListItem>
}