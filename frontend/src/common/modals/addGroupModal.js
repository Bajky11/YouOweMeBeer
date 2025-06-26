import { Button, Stack, TextField, Typography } from "@mui/material";
import { ReusableModal } from "../../pages/home/Home";
import useForm from "../hooks/useForm";
import { useCreateGroupMutation } from "../../services/api/group/groupApi";

export const AddGroupModal = ({ open, onClose, data }) => {
    const { formData, handleChange, resetForm } = useForm({ name: "" });
    const [createGroup] = useCreateGroupMutation();

    const handleCreate = async () => {
        await createGroup(formData);
        onClose();
    };

    return (
        <ReusableModal open={open}
            onClose={onClose}
            title="Vytvořit skupinu"
        >
            <Stack spacing={2}>
                <Stack direction={"row"} spacing={2}>
                    <TextField label="Jméno skupiny"
                        name={"name"}
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />
                   
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Button variant="contained" onClick={handleCreate} fullWidth>Vytvořit</Button>
                </Stack>
            </Stack>
        </ReusableModal>
    )
}