import { Button, Checkbox, Divider, Stack, TextField, Typography } from "@mui/material";
import { ReusableModal } from "../../pages/home/Home";
import useForm from "../hooks/useForm";
import { useCreateGroupMutation } from "../../services/api/group/groupApi";
import React from "react";
import { useCreateBeerMutation } from "../../services/api/beer/beerApi";
import { useSelector } from "react-redux";

export const AddBeersModal = ({ open, onClose, data }) => {
    const [selectedUsers, setSelectedUsers] = React.useState([]);
    const user = useSelector(state => state.auth.user);
    const [createBeer] = useCreateBeerMutation();

    const handleAddBeers = async () => {
        console.log("Selected users:", selectedUsers);
        for (const userId of selectedUsers) {
            await createBeer({
                group: { id: data.id },
                fromUser: { id: user.id },
                toUser: { id: userId },
                count: 1,
                createdAt: new Date().toLocaleString("sv-SE", { timeZone: "Europe/Prague" }).replace(" ", "T")
            });
        }
        setSelectedUsers([]);
        onClose();
    };

    const handleCheckboxChange = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id)
                ? prev.filter(u => u !== id)
                : [...prev, id]
        );
    };

    return (
        <ReusableModal open={open}
            onClose={onClose}
            title="Koupil jsem piova pro:"
        >
            <Stack spacing={2}>
                <Stack
                    direction={"column"}
                    spacing={1}
                    divider={<Divider />}
                    sx={{
                        maxHeight: 300,
                        overflowY: "auto",
                    }}
                >
                    {
                        data && data.users && data.users.map((user) => {
                            const isSelected = selectedUsers.includes(user.id);
                            return (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    key={user.username}
                                    sx={{
                                        bgcolor: isSelected ? "action.selected" : "transparent",
                                        borderRadius: 1,
                                        px: 1,
                                    }}
                                    onClick={() => handleCheckboxChange(user.id)}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        color="primary"
                                    />
                                    <Typography component="span">{user.username}</Typography>
                                </Stack>
                            );
                        })
                    }
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Button
                        variant="contained"
                        onClick={handleAddBeers}
                        fullWidth
                        disabled={selectedUsers.length === 0}
                    >
                        Přidat
                    </Button>
                </Stack>
            </Stack>
        </ReusableModal>
    )
}