
import React, { useEffect, useState } from "react";
import {
    useMediaQuery,
    Container,
    useTheme,
    Grid,
    Typography,
    Button
} from '@mui/material';

import Box from '@mui/material/Box';
import Header from "../Header";
import { useRouter } from "next/router";
import { tokens } from "../../config/theme";
import StoreIcon from '@mui/icons-material/Store';
import Person2Icon from '@mui/icons-material/Person2';
import PeopleIcon from '@mui/icons-material/People';
export default function CompanyPage() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const router = useRouter()

    return (
        <div>
            <Container>
                <Box

                    sx={{
                        marginTop: 8,

                    }}
                >
                    <Header title="Admin Dashboard" />
                    <Grid container spacing={2} columns={{ xs: 6, sm: 6, md: 12 }} >
                        <GridItem
                            title='Companies'
                            icon={<StoreIcon sx={{color: 'white'}} />}
                        />
                        <GridItem
                            title='Employers'
                            icon={<Person2Icon sx={{color: 'white'}}/>}
                        />
                        <GridItem
                            title='Users'
                            icon={<PeopleIcon sx={{color: 'white'}}/>}

                        />
                    </Grid>
                </Box>
            </Container>

        </div>
    )
}


const GridItem = ({ title,  icon }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Grid item xs={3} sm={3} md={4} >
            <Button
                startIcon={icon}
                sx={{
                    borderRadius: '5px',
                    height: 100,
                    width: 1,
                    p: '10px',
                    background: `${colors.blueAccent[500]}`,
                    "&:hover": {
                        backgroundColor: `${colors.blueAccent[400]} !important`
                    },


                }}>
                <Typography
                    variant="h5"
                    color='white'
                    // sx={{ marginLeft: '10px' }}
                >
                    {title}
                </Typography>
            </Button>
        </Grid>
    )
}
