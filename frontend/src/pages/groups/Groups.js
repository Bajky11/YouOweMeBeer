import { Button, List, Stack, Typography } from "@mui/material"
import { ListSection } from "../../common/components/ListSection"
import { ListSectionItemButton } from "../../common/components/ListSectionItemButton"
import { AccountCircleOutlined, DeleteOutline, EditOutlined, Event, Group, JoinFull, Logout } from "@mui/icons-material"
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useNavigate } from "react-router-dom"
import { useGetMyGroupsQuery } from "../../services/api/group/groupApi"
import useModal from "../../common/hooks/useModal"
import { UpdateTaskModal } from "../home/Home"
import { AddGroupModal } from "../../common/modals/addGroupModal"
import { JoinGroupModal } from "../../common/modals/joinGroupModal"
import { useSelector } from "react-redux"

export const Groups = () => {
    const navigate = useNavigate();
    const { data: myGroups, isLoading: myGroupsLoading } = useGetMyGroupsQuery();

    const {
        open: updateModalOpen,
        data: updateModalData,
        handleOpen: handleOpenUpdateModal,
        handleClose: handleCloseUpdateModal
    } = useModal();

    const {
        open: updateModalOpen1,
        data: updateModalData1,
        handleOpen: handleOpenUpdateModal1,
        handleClose: handleCloseUpdateModal1
    } = useModal();

    if (myGroupsLoading) return "Načítám...";

    return <Stack spacing={4} paddingTop={1}>
        <Stack spacing={0.5} >
            <Typography variant={"h6"} paddingLeft={0.5}>
                Akce
            </Typography>
            <Stack spacing={1}>
                <Button variant={"outlined"} color={"primary"} onClick={handleOpenUpdateModal} >
                    Vytvořit novou skupinu
                </Button>

                <Button variant={"contained"} color={"primary"}  onClick={handleOpenUpdateModal1}>
                    Připojit se ke skupině
                </Button>
            </Stack>
        </Stack>

        <Stack spacing={0.5}>
            <Typography variant={"h6"} paddingLeft={0.5}>
                Moje skupiny
            </Typography>

            <Stack spacing={1}>
                {
                    myGroups && myGroups.map(group => (
                        <ListSection key={group.id}>
                            <ListSectionItemButton
                                variant={"single"}
                                label={group.name}
                                helperText={`Skupina se ${group.users.length} členy.`}
                                Icon={<Group />}
                                onClick={() => navigate(`/group/${group.id}`)}
                            />
                        </ListSection>
                    ))
                }
            </Stack>
        </Stack>
        <AddGroupModal open={updateModalOpen} onClose={handleCloseUpdateModal} data={updateModalData} />
        <JoinGroupModal open={updateModalOpen1} onClose={handleCloseUpdateModal1} data={updateModalData1} />
    </Stack>
}