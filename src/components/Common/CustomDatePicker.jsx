import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePicker = ({ label, filterDate, onChange }) => {
    const [selectedDate, setSelectedDate] = React.useState(null);

    const datePickerRef = useRef(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onChange(date);
    };

    const openCalendar = () => {
        datePickerRef.current.setOpen(true);
    };

    return (
        <div className="custom-date-picker">
            <DatePicker
                ref={datePickerRef}
                selected={selectedDate}
                onChange={handleDateChange}
                filterDate={filterDate}
                dateFormat="dd-MM-yyyy"
                placeholderText={label}
                className="form-control date-input"
            />
            <div className="calendar-btn" onClick={openCalendar}>
                <i className="bx bx-calendar"></i>
            </div>
        </div>
    );
};

export default CustomDatePicker;