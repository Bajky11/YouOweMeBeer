import { Button, Divider, List, ListItem, ListItemButton, Stack, Typography } from "@mui/material";
import { AccountCircle, AccountCircleOutlined, Delete, DeleteOutline, Edit, EditOutlined, Logout, Money, Payments } from "@mui/icons-material";
import { ListSection } from "../../common/components/ListSection";
import { ListSectionItemButton } from "../../common/components/ListSectionItemButton";
import { useNavigate } from "react-router-dom";
import useModal from "../../common/hooks/useModal";
import { ChangeUsernameModal } from "../../common/modals/changeUsernameModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/slice/auth/authSlice";
import Cookies from 'js-cookie';
import { authApi } from "../../services/api/auth/authApi";
import { tasksApi } from "../../services/api/tasks/tasksApi";
import { groupApi } from "../../services/api/group/groupApi";
import { beerApi } from "../../services/api/beer/beerApi";
import { userApi } from "../../services/api/user/userApi";

export const Options = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const {
        open: updateModalOpen,
        data: updateModalData,
        handleOpen: handleOpenUpdateModal,
        handleClose: handleCloseUpdateModal
    } = useModal();

    const handleLogout = () => {
        Cookies.remove('user', { path: '/' });
        dispatch(authApi.util.resetApiState());
        dispatch(tasksApi.util.resetApiState());
        dispatch(groupApi.util.resetApiState());
        dispatch(beerApi.util.resetApiState());
        dispatch(userApi.util.resetApiState());
        navigate("/login");
    }

    return (
        <Stack spacing={4} paddingTop={1}>
            <ListSection title={"Authentication"}>
                <ListSectionItemButton variant={"top"} label={user ? user.username : "Unknown user"} helperText={"Currently logged in user."} Icon={<AccountCircleOutlined />} />
                <ListSectionItemButton variant={"bottom"} label={"Log out"} Icon={<Logout />} onClick={handleLogout} />
            </ListSection>

            <ListSection title={"Account"}>
                <ListSectionItemButton variant={"top"} label={"Change username"} helperText={"Username is used to login it muset be unique."} Icon={<EditOutlined />} onClick={handleOpenUpdateModal} />
                <ListSectionItemButton variant={"bottom"} label={"Delete account"} helperText={"This action can not be taken back!"} Icon={<DeleteOutline />} />
            </ListSection>
            <ChangeUsernameModal open={updateModalOpen} onClose={handleCloseUpdateModal} data={updateModalData} />
        </Stack>
    )
}



