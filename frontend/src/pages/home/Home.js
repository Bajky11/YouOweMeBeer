import {
    Box,
    Button,
    Chip,
    Divider,
    Fab,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem, Modal,
    Select,
    Stack, TextField,
    Typography
} from "@mui/material";
import {
    Add,
    Close,
    PauseOutlined, PlayArrowOutlined, StopOutlined
} from "@mui/icons-material";
import {
    useCompleteTaskMutation,
    useCreateTaskMutation,
    useGetActiveTaskQuery,
    useGetTasksQuery,
    useGetTaskSummaryQuery,
    usePauseTaskMutation,
    useStartTaskMutation
} from "../../services/api/tasks/tasksApi";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { formatDateToDDMMYYYY, formatSecondsToHHmm } from "../../common/functions/functions";
import useForm from "../../hooks/useForm";

export const Home = () => {

    const [timePeriod, setTimePeriod] = useState(`month`);
    const [open, setOpen] = useState(false);
    const { data: tasks, isLoading, error } = useGetTasksQuery({ filter: timePeriod });

    if (isLoading) return <p>Načítání...</p>;
    if (error) return <p>Chyba při načítání</p>;

    return (<Stack spacing={2}>
        <ActiveTasks />
        <Stack direction={"row"} spacing={2}>

            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Time period</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    label="Time period"
                    variant={"outlined"}>
                    <MenuItem value={`week`}>Week</MenuItem>
                    <MenuItem value={`month`}>Month</MenuItem>
                    <MenuItem value={`year`}>Year</MenuItem>
                    <MenuItem value={`all`}>All</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Tag</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    value={10}
                    label="Tag"
                    variant={"outlined"}>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>


        </Stack>
        <Summary timePeriod={timePeriod} />

        <Stack px={2} pt={2} spacing={2}>
            {tasks.map((task, index) => (<Fragment key={task.id}>
                <TaskListItem task={task} />
                {index < tasks.length - 1 && <Divider />}
            </Fragment>))}
        </Stack>
        <FloatingButton onClick={() => setOpen(true)} />
        <AddNewTaskModal open={open} setOpen={setOpen} />
    </Stack>

    )
}
/*
{
  "name": "Dokončit projekt",
  "hourlyRate": 450,
  "tag": "work",
  "status": "PAUSED"
}
 */

const UpdateTaskModal = ({ open, setOpen }) => {

    return (
        <ReusableModal open={open}
            onClose={() => setOpen(false)}
            title="Nový záznam"
        >
            <Stack spacing={2}>
                ahoj
            </Stack>
        </ReusableModal>
    )
}

const AddNewTaskModal = ({ open, setOpen }) => {
    const [createTask] = useCreateTaskMutation();

    const { formData, handleChange, resetForm } = useForm({
        name: "",
        tag: "work",
        hours: "",
        minutes: ""
    });

    const handleStartTask = useCallback((e) => {
        handleCreateTask(e, formData, "RUNNING");
    }, [formData]);

    const handleAddTask = useCallback((e) => {
        handleCreateTask(e, formData, "COMPLETED");
    }, [formData]);

    const handleCreateTask = async (event, formData, status) => {
        event.preventDefault(); // ✅ Zabráníme přesměrování formuláře

        console.log("📝 Odesílám úkol:", { ...formData, status });

        const totalTime =formData.hours * 3600 + formData.minutes * 60

        try {
            await createTask({
                name: formData.name.trim(), // ✅ Ořezání bílých znaků
                hourlyRate: 450,
                tag: formData.tag.trim(),
                status: status,
                totalTime: totalTime || 0
            });

            resetForm();
            setOpen(false);
        } catch (error) {
            console.error("Chyba při vytváření úkolu:", error);
        }
    };

    return (
        <ReusableModal open={open}
            onClose={() => setOpen(false)}
            title="Nový záznam"
        >
            <Typography color="gray">Základní údaje</Typography>
            <Stack spacing={2}>
                <TextField label="Název"
                    name={"name"}
                    required={true}
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextField label="Tag"
                    name={"tag"}
                    required={true}
                    fullWidth
                    value={formData.tag}
                    onChange={handleChange}
                />
                <Typography color="gray">Odpracováno</Typography>
                <Stack direction={"row"} spacing={2}>
                    <TextField label="Hodiny"
                        name={"hours"}
                        fullWidth
                        value={formData.hours}
                        onChange={handleChange}
                    />
                    <TextField label="Minuty"
                        name={"minutes"}
                        fullWidth
                        value={formData.minutes}
                        onChange={handleChange}
                    />
                </Stack>
                <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                    <Button variant="outlined" onClick={handleAddTask}>přidat úkol</Button>
                    <Button variant="contained" onClick={handleStartTask}>splustit úkol</Button>
                </Stack>
            </Stack>
        </ReusableModal>
    )
}

const ReusableModal = ({ open, onClose, title, children }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "70%",
                    height: "50%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,

                }}
            >
                <Stack spacing={2}>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography variant="h6" component="h2">
                            {title}
                        </Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Stack>
                    {children}
                </Stack>
            </Box>
        </Modal>
    );
};

const FloatingButton = ({ onClick }) => {
    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 80,
                right: 40,
                zIndex: 1000,
            }}
        >
            <Fab color="#D7D7D7" aria-label="add" onClick={onClick}>
                <Add />
            </Fab>
        </Box>
    );
};

export default FloatingButton;

function ActiveTasks() {

    const { data: tasks, isLoading, error } = useGetActiveTaskQuery();

    if (isLoading) return <p>Načítání...</p>;
    if (error) return null;
    if (!tasks) return null;

    return (<Stack spacing={2}>

        {
            tasks.map((task, index) => {
                return <ActiveTaskItem task={task} key={index} />

            })
        }
    </Stack>

    )
}

function ActiveTaskItem({ task }) {
    const [elapsedTime, setElapsedTime] = useState(task.totalTime || 0);
    const [startTask] = useStartTaskMutation();
    const [pauseTask] = usePauseTaskMutation();
    const [completeTask] = useCompleteTaskMutation();
    const timerRef = useRef(null);

    const red = "184,72,72";
    const green = "10,147,0";
    const orange = "208,112,39"

    function resolveStatusColor(status) {
        switch (status) {
            case "PAUSED":
                return orange;
            case "COMPLETED":
                return red;
            case "RUNNING":
                return green;
        }
    }

    const calculateElapsedTime = (startTime, totalTime) => {
        if (!startTime || isNaN(Date.parse(startTime))) {
            return totalTime; // Pokud startTime není platné, vracíme totalTime
        }

        const startTimestamp = new Date(startTime + "Z").getTime();
        const nowTimestamp = Date.now();
        // Rozdíl v sekundách (zabráníme záporné hodnotě, pokud by startTime byl v budoucnu)
        const elapsedSinceStart = Math.max(Math.floor((nowTimestamp - startTimestamp) / 1000), 0);

        return totalTime + elapsedSinceStart;
    };


    useEffect(() => {
        setElapsedTime(calculateElapsedTime(task.startTime, task.totalTime));
    }, [task.startTime]);

    useEffect(() => {
        if (task.status === "RUNNING") {
            timerRef.current = setInterval(() => {
                setElapsedTime(calculateElapsedTime(task.startTime, task.totalTime));
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [task.status]);

    return (
        <Stack bgcolor={`rgba(${resolveStatusColor(task.status)}, 0.1)`}
            border={`1px solid rgba(${resolveStatusColor(task.status)}, 0.5)`}
            borderRadius={4}
            spacing={1}
            padding={1.5}>
            <Stack direction={`row`} spacing={2} alignItems={"center"}>
                <Typography fontSize={20}>{task.name}</Typography>
                <Chip label={task.tag} sx={{ height: 30, color: "gray" }} />
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography fontSize={24}
                    fontWeight={"bold"}>{formatSecondsToHHmm(elapsedTime, true)}</Typography>
                <Stack direction={"row"} spacing={2}>
                    <TaskActionItem Icon={<StopOutlined />} bgColor={`#B84848`}
                        onClick={() => completeTask(task.id)} />
                    <TaskActionItem Icon={<PlayArrowOutlined />} bgColor={`#0A9300`}
                        onClick={() => startTask(task.id)} />
                    <TaskActionItem Icon={<PauseOutlined />} bgColor={`#D07027`}
                        onClick={() => pauseTask(task.id)} />
                </Stack>
            </Stack>
        </Stack>
    )
}

function TaskActionItem({ Icon, bgColor, border, onClick }) {
    return (<Stack bgcolor={bgColor} borderRadius={2} border={border || null} onClick={onClick}>
        {Icon}
    </Stack>)
}

function Summary({ timePeriod }) {

    const { data: summary, summaryIsLoading, summaryError } = useGetTaskSummaryQuery({ filter: timePeriod });

    if (summaryIsLoading) return <p>Načítání...</p>;
    if (summaryError) return <p>Chyba při načítání</p>;

    return (<Stack bgcolor={`#F6F6F6`} borderRadius={4} border={"1px solid rgba(215, 215, 215, 0.5)"} p={2}
        direction={"row"}
        justifyContent={"space-between"}>
        <Stack alignItems={"center"}>
            <Typography>Výdělek</Typography>
            <Typography fontWeight={"bold"}>{summary?.totalEarnings + " Kč"}</Typography>
        </Stack>
        <Stack alignItems={"center"}>
            <Typography>Hodiny</Typography>
            <Typography fontWeight={`bold`}>{formatSecondsToHHmm(summary?.totalTime)}</Typography>
        </Stack>
        <Stack alignItems={"center"}>
            <Typography>Záznamů</Typography>
            <Typography fontWeight={"bold"}>{summary?.totalTasks}</Typography>
        </Stack>
    </Stack>)
}

function TaskListItem({ task }) {

    const [createTask] = useCreateTaskMutation();
    const [open, setOpen] = useState(false);


    const handleCreate = async (event) => {
        event.stopPropagation();
        await createTask({
            name: task.name, hourlyRate: 450, tag: "work", status: "PAUSED"
        });
    };

    return (
        <Stack spacing={1} onClick={() => setOpen(true)}>
            <Typography fontSize={18}>{task.name}</Typography>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Typography fontSize={14} color={"gray"}>{formatDateToDDMMYYYY(task.createdAt)}</Typography>
                <Chip label={task.tag} sx={{ height: 30, color: "gray", border: "1px solid rgba(215, 215, 215, 0.5)" }}
                    variant="outlined" />
                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Typography fontSize={14} color={"gray"}>{formatSecondsToHHmm(task.totalTime)}</Typography>
                    <TaskActionItem
                        Icon={<PlayArrowOutlined />}
                        bgColor={`#F6F6F6`}
                        border={"1px solid rgba(215, 215, 215, 0.5)"}
                        onClick={handleCreate}
                    />
                </Stack>
            </Stack>
            <UpdateTaskModal open={open} setOpen={setOpen} />
        </Stack>
    )
}