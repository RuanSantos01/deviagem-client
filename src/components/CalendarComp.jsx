import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'react-date-range'
import format from 'date-fns/format'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { Box, TextField, useTheme } from '@mui/material'

import ptBR from 'date-fns/locale/pt-BR'
import { useFormik } from 'formik'

const CalendarComp = (props) => {
    const { handleDataNascimento } = props;
    const theme = useTheme();
    const blueColor = theme.palette.background.blue;

    const [calendar, setCalendar] = useState('')

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

    const handleSelect = (date) => {
        setCalendar(format(date, 'dd/MM/yyyy'))
        formik.setFieldValue('dataNascimento', calendar)
        formik.handleSubmit();
    }

    const formik = useFormik({
        initialValues: {
            dataNascimento: ''
        },
        onSubmit: values => {
            handleDataNascimento(values.dataNascimento)
        }
    })

    return (
        <Box className="calendarWrap" sx={{ width: '47%' }}>

            <form onSubmit={formik.handleSubmit}>
                <TextField
                    sx={{ width: '100%' }}
                    onBlur={formik.handleBlur}
                    label='Data de nascimento*'
                    className="inputBox"
                    readOnly
                    name="dataNascimento"
                    onClick={() => setOpen(open => !open)}
                    InputProps={{
                        style: { backgroundColor: "white", borderRadius: "4px" },
                    }}
                    InputLabelProps={{
                        style: { color: blueColor, fontWeight: "200", fontSize: "1rem" }
                    }}
                />

                <div ref={refOne} type='submit'>
                    {open &&
                        <Calendar
                            locale={ptBR}
                            onChange={(e) => handleSelect(e)}
                            className="calendarElement"
                        />
                    }
                </div>
            </form>

        </Box>
    )
}

export default CalendarComp;