import { useParams } from "react-router-dom";
import { ListSection } from "../../common/components/ListSection";
import { ListSectionItemButton } from "../../common/components/ListSectionItemButton";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageLabel } from "../../services/slice/app/appSlice";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useCreateBeerMutation, useDeleteBeerMutation, useGetBeersByGroupIdQuery, useGetDebtsByGroupQuery, useGetTotalBeersReceivedByUserQuery } from "../../services/api/beer/beerApi";
import { useGetGroupByIdQuery } from "../../services/api/group/groupApi";
import useModal from "../../common/hooks/useModal";
import { AddBeersModal } from "../../common/modals/addBeersModal";

export const Group = () => {
    const { id } = useParams();
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [showDebts, setShowDebts] = useState(true);
    const { data: group, isLoading: groupLoading } = useGetGroupByIdQuery(id);
    const { data: debt, isLoading: debtsLoading } = useGetDebtsByGroupQuery(id, {
        pollingInterval: 5000,
    });
    const { data: received, isLoading: receivedLoading } = useGetTotalBeersReceivedByUserQuery(id, {
        pollingInterval: 5000,
    });
    const { data: beers, isLoading: beersByGroupLoading } = useGetBeersByGroupIdQuery(id, {
        pollingInterval: 30000,
    });
    const [createBeer] = useCreateBeerMutation();

    const {
        open: updateModalOpen,
        data: updateModalData,
        handleOpen: handleOpenUpdateModal,
        handleClose: handleCloseUpdateModal
    } = useModal();

    useEffect(() => {
        if (groupLoading === false) {
            dispatch(setPageLabel(group.name + "   (id: " + group.id + ")"));
        }
    }, [group]);

    const handleAddBeer = async () => {
        await createBeer({
            group: { id: group.id },
            fromUser: { id: user.id },
            toUser: { id: user.id },
            count: 1,
            createdAt: new Date().toLocaleString("sv-SE", { timeZone: "Europe/Prague" }).replace(" ", "T")
        });
    }

    if (debtsLoading || receivedLoading || groupLoading || beersByGroupLoading) return "Načítám ...";

    return (
        <Stack spacing={3} paddingTop={1}>

            <Stack spacing={0.5}>
                <Typography variant="h6" paddingLeft={0.5}>
                    Akce
                </Typography>
                <Stack spacing={1}>
                    <Button variant={"contained"} color={"primary"} onClick={() => handleOpenUpdateModal(group)} >
                        Koupil jsem piva!
                    </Button>
                    <Button variant={"outlined"} color={"primary"} onClick={() => handleAddBeer()} >
                        Dal jsem si jedno sám.
                    </Button>
                </Stack>
            </Stack>



            <Stack spacing={0.5}>
                <Typography variant="h6" paddingLeft={0.5}>
                    Přehled
                </Typography>
                <Stack spacing={1}>
                    <ToggleButtonGroup
                        value={showDebts ? "debts" : "leaderboard"}
                        exclusive
                        onChange={(_, value) => {
                            if (value !== null) setShowDebts(value === "debts");
                        }}
                        color="primary"
                        fullWidth
                    >
                        <ToggleButton value="debts">Pivní dluhy</ToggleButton>
                        <ToggleButton value="leaderboard">Žebříček</ToggleButton>
                    </ToggleButtonGroup>

                    {showDebts ? <Stack spacing={2}>
                        <Debts debt={debt} />
                        <BeerTransactions beers={beers} />
                    </Stack> : <Leaderboard users={received} />}
                </Stack>
            </Stack>
            <AddBeersModal open={updateModalOpen} onClose={handleCloseUpdateModal} data={updateModalData} />
        </Stack>
    );
}

const Debts = ({ debt }) => {
    if (!debt || debt.length === 0) {
        return (
            <ListSection>
                <ListSectionItemButton
                    label="Žádné dluhy"
                    helperText={null}
                    variant="single"
                />
            </ListSection>
        );
    }

    return (
        <ListSection >
            {debt.map((item, idx) => (
                <ListSectionItemButton
                    key={idx}
                    label={`${item.fromUser.username} → ${item.toUser.username}`}
                    helperText={`Dluh: ${item.debt} 🍺`}
                    variant={
                        debt.length === 1 ? "single" :
                            idx === 0 ? "top" :
                                idx === debt.length - 1 ? "bottom" : "middle"
                    }
                />
            ))}
        </ListSection>
    );
}


const Leaderboard = ({ users }) => {
    if (!users || Object.keys(users).length === 0) {
        return (
            <ListSection>
                <ListSectionItemButton
                    label="Nikdo zatím  nepije!"
                    helperText={null}
                    variant="single"
                />
            </ListSection>
        );
    }

    return (
        <ListSection >
            {Object.entries(users)
                .sort((a, b) => b[1] - a[1])
                .map(([username, count], idx, arr) => (
                    <ListSectionItemButton
                        key={username}
                        label={`${idx + 1}. ${username}`}
                        helperText={`Vypito: ${count} 🍺`}
                        variant={
                            arr.length === 1 ? "single" :
                                idx === 0 ? "top" :
                                    idx === arr.length - 1 ? "bottom" : "middle"
                        }
                    />
                ))}
        </ListSection>
    );
}

const BeerTransactions = ({ beers }) => {
    const [deleteBeer] = useDeleteBeerMutation();

    const handleDeleteBeer = (id) => {
        deleteBeer(id);
    };

    return (
        <ListSection title={`Pivní transakce (${beers.length})`}>
            {beers.length === 0 ? (
                <ListSectionItemButton
                    label="Žádné transakce"
                    helperText={null}
                    variant="single"
                />
            ) : (
                beers.map((item, idx) => {
                    const date = new Date(item.createdAt);
                    const formattedDate = date.toLocaleDateString("cs-CZ", { year: 'numeric', month: '2-digit', day: '2-digit' }) +
                        ' ' + date.toLocaleTimeString("cs-CZ", { hour: '2-digit', minute: '2-digit' });
                    return (
                        <ListSectionItemButton
                            onRemove={() => handleDeleteBeer(item.id)}
                            key={item.id}
                            label={`${item.fromUser.username} → ${item.toUser.username}`}
                            helperText={`Koupil ${item.count} 🍺 dne ${formattedDate}`}
                            variant={
                                beers.length === 1 ? "single" :
                                    idx === 0 ? "top" :
                                        idx === beers.length - 1 ? "bottom" : "middle"
                            }
                        />
                    );
                })
            )}
        </ListSection>
    );
}