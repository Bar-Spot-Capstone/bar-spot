import { useState } from "react";
import "../styles/TimerInput.css"
/*Credit to:
https://dev.to/andrewchmr/react-hh-mm-ss-time-input-cfl
https://codepen.io/andrewchmr-the-vuer/pen/wvWLRVw
*/

const TimerInput: any = (props: any): any => {
    const [value, setValue] = useState("0:00");
    const readOnly: Boolean = props.readOnly;

    console.log(`The boolean value is ${readOnly}`);

    const onChangeI = (event) => {
        setValue(event.target.value);
    };

    const onBlur = (event) => {
        const value: string = event.target.value;
        const seconds: Number = Math.max(0, getSecondsFromHHMMSS(value));

        const time: string = toHHMMSS(seconds);
        setValue(time);
    };

    const getSecondsFromHHMMSS = (value) => {
        const [str1, str2, str3] = value.split(":");

        const val1: Number = Number(str1);
        const val2: Number = Number(str2);
        const val3: Number = Number(str3);

        if (!isNaN(val1) && isNaN(val2) && isNaN(val3)) {
            return val1;
        }

        if (!isNaN(val1) && !isNaN(val2) && isNaN(val3)) {
            return val1 * 60 + val2;
        }

        if (!isNaN(val1) && !isNaN(val2) && !isNaN(val3)) {
            return val1 * 60 * 60 + val2 * 60 + val3;
        }

        return 0;
    };

    const toHHMMSS = (secs) => {
        const secNum: Number = parseInt(secs.toString(), 10);
        const hours: Number = Math.floor(secNum / 3600);
        const minutes: Number = Math.floor(secNum / 60) % 60;
        const seconds: Number = secNum % 60;

        return [hours, minutes, seconds]
            .map((val) => (val < 10 ? `0${val}` : val))
            .filter((val, index) => val !== "00" || index > 0)
            .join(":")
            .replace(/^0/, "");
    };

    return (
        <div>
            {readOnly ?
                <input className="timer-input" type="text" onBlur={onBlur} value={value} readonly />
                :
                <input className="timer-input" type="text" onChange={onChangeI} onBlur={onBlur} value={value} />
            }
        </div>

    );
}

export default TimerInput