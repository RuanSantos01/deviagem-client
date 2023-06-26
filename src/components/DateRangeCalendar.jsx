import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'

import format from 'date-fns/format'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { Box, InputAdornment, TextField, useMediaQuery, useTheme } from '@mui/material'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const DateRangeCalendar = (props) => {
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;
    const isNonMobile = useMediaQuery("(min-width:1200px)");
    const [range, setRange] = useState([
        {
            startDate: undefined,
            endDate: undefined,
            key: 'selection'
        }
    ])

    const [open, setOpen] = useState(false)
    const refOne = useRef(null)

    useEffect(() => {
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutside, true)
    }, [])

    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setOpen(false)
        }
    }

    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setOpen(false)
        }
    }

    const handleRangeSelection = (item) => {
        setRange([item.selection])
        props.endDate(item.selection.endDate)
        props.startDate(item.selection.startDate)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: props.filter ? 'row' : 'column', position: 'relative', gap: props.filter ? '1rem' : '1.5rem' }}>

            <TextField
                label='Ida'
                variant='filled'
                value={range[0].startDate ? format(range[0].startDate, "dd/MM/yyyy") : 'Data'}
                readOnly
                onClick={() => setOpen(open => !open)}
                sx={{ width: isNonMobile ? 'auto' : '44vw', position: 'relative', top: isNonMobile && props.filter ? '-35px' : '' }}
                InputProps={{
                    style: { backgroundColor: "white", borderRadius: "4px", fontWeight: 600, color: range[0].startDate ? 'black' : 'rgba(173, 173, 173)' },
                    placeholder: 'Data',
                    startAdornment: isNonMobile ? (
                        <InputAdornment sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingRight: '10px'
                        }}><CalendarMonthIcon sx={{ color: 'black' }} /></InputAdornment>
                    ) : (<></>)
                }}
                InputLabelProps={{
                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem", marginLeft: isNonMobile ? '30px' : '' }
                }}
            />

            <TextField
                label='Volta'
                variant='filled'
                value={range[0].endDate ? format(range[0].endDate, "dd/MM/yyyy") : 'Data'}
                readOnly
                onClick={() => setOpen(open => !open)}
                sx={{ width: isNonMobile ? 'auto' : '44vw', position: 'relative', top: isNonMobile && props.filter ? '-35px' : '' }}
                InputProps={{
                    style: { backgroundColor: "white", borderRadius: "4px", fontWeight: 600, color: range[0].endDate ? 'black' : 'rgba(173, 173, 173)' },
                    startAdornment: isNonMobile ? (
                        <InputAdornment sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingRight: '10px'
                        }}><CalendarMonthIcon sx={{ color: 'black' }} /></InputAdornment>
                    ) : (<></>)
                }}
                InputLabelProps={{
                    style: { color: blueColor, fontWeight: "bold", fontSize: "1rem", marginLeft: isNonMobile ? '30px' : '' }
                }}
            />

            <Box
                sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: '40px',
                    zIndex: '999',
                }}
                ref={refOne}>
                {open &&
                    <DateRange
                        sx={{
                            boxShadow: "4px 4px 2px rgba(0, 0, 0, 0.3)"
                        }}
                        onChange={item => handleRangeSelection(item)}
                        editableDateInputs={true}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                        months={isNonMobile ? 2 : 1}
                        direction="horizontal"
                        startDatePlaceholder="Início"
                        endDatePlaceholder="Fim"
                    />
                }
            </Box>

        </Box>
    )
}

export default DateRangeCalendar;