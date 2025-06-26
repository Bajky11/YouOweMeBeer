import { Button, Stack, TextField, Typography } from "@mui/material";
import { ReusableModal } from "../../pages/home/Home";
import useForm from "../hooks/useForm";
import { useUpdateUserMutation } from "../../services/api/user/userApi";
import { useSelector } from "react-redux";

export const ChangeUsernameModal = ({ open, onClose, data }) => {
    const { formData, handleChange, resetForm } = useForm({ username: "" });
    const user = useSelector(state => state.auth.user);
    const [updateUser] = useUpdateUserMutation();

    const handleChangeUsername = async () => {
        await updateUser({ id: user.id, username: formData.username });
        onClose();
    };

    return (
        <ReusableModal open={open}
            onClose={onClose}
            title="Změnit uživatelské jméno"
        >
            <Stack spacing={2}>
                <Stack direction={"row"} spacing={2}>
                    <TextField label="Nové jméno"
                        name={"username"}
                        fullWidth
                        value={formData.username}
                        onChange={handleChange}
                    />

                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Button variant="contained" onClick={handleChangeUsername} fullWidth>Změnit</Button>
                </Stack>
            </Stack>
        </ReusableModal>
    )
}