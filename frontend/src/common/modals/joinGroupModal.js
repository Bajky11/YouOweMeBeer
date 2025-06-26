import { Button, Stack, TextField } from "@mui/material";
import { ReusableModal } from "../../pages/home/Home";
import useForm from "../hooks/useForm";
import { useAddUserToGroupMutation } from "../../services/api/group/groupApi";

export const JoinGroupModal = ({ open, onClose, data }) => {
    const { formData, handleChange, resetForm } = useForm({ id: 0 });
    const [addUserToGroup] = useAddUserToGroupMutation();

    const handleAddUserToGroup = async () => {
        addUserToGroup(formData.id)
        onClose();
    };

    return (
        <ReusableModal open={open}
            onClose={onClose}
            title="Připojit se ke skupině"
        >
            <Stack spacing={2}>
                <Stack direction={"row"} spacing={2}>
                    <TextField label="ID skupiny"
                        name={"id"}
                        fullWidth
                        value={formData.id}
                        onChange={handleChange}
                    />

                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Button variant="contained" onClick={handleAddUserToGroup} fullWidth>Připojit</Button>
                </Stack>
            </Stack>
        </ReusableModal>
    )
}