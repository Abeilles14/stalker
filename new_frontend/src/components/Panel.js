import React, { useState } from 'react'
import { Grid, ToggleButtonGroup, ToggleButton, Stack, Typography } from "@mui/material"

const MODES = Object.freeze({
    AUTOMATIC: 0,
    MANUAL: 1,
  });
  
const MISSION = Object.freeze({
    USC_2022_TASK_1: 0,
    USC_2022_TASK_2: 1,
});

const Panel = () => {
    const [mode, setMode] = useState(0);
    const [task, setTask] = useState(0);
    const [controllerStatus, setControllerStatus] = useState('TODO');

    const handleChangeMode = (event, newMode) => {
        if (newMode !== null) {
          setMode(newMode);
          console.log(newMode);
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: mode })
          };
      
          fetch("http://localhost:6923/controlmode", requestOptions)
    };
    const handleChangeTask = (event, newTask) => {
        if (newTask !== null) {
          setTask(newTask);
          console.log(newTask);
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mission: task })
          };
      
          fetch("http://localhost:6923/missionstatus", requestOptions)
    };

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={2}>
                <Stack alignItems="center">
                    <ToggleButtonGroup value={mode} exclusive onChange={handleChangeMode}>
                        <ToggleButton value={MODES.MANUAL}>Manual</ToggleButton>
                        <ToggleButton value={MODES.AUTOMATIC}>Auto</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Grid>
            <Grid item xs={2}>
                <Stack alignItems="center" gap={1}>
                <Typography variant='h7'>Controller:</Typography>
                <Typography variant='h7'>{controllerStatus}</Typography>
                </Stack>
            </Grid>
            <Grid item xs={2}>
                <Stack alignItems="center" gap={1}>
                <Typography>Task:</Typography>
                <ToggleButtonGroup value={task} exclusive onChange={handleChangeTask}>
                    <ToggleButton value={MISSION.USC_2022_TASK_1}>1</ToggleButton>
                    <ToggleButton value={MISSION.USC_2022_TASK_2}>2</ToggleButton>
                </ToggleButtonGroup>
                </Stack>
            </Grid>
        </Grid>
    );
}

export default Panel;