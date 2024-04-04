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

    const onChangeI = (event:any) => {
        setValue(event.target.value);
    };

    const onBlur = (event:any) => {
        const value: string = event.target.value;
        const seconds: number = Math.max(0, getSecondsFromHHMMSS(value));

        const time: string = toHHMMSS(seconds);
        setValue(time);
    };

    const getSecondsFromHHMMSS = (value:any) => {
        const [str1, str2, str3] = value.split(":");

        const val1: number = Number(str1);
        const val2: number = Number(str2);
        const val3: number = Number(str3);

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

    const toHHMMSS = (secs:any) => {
        const secNum: number = parseInt(secs.toString(), 10);
        const hours: number = Math.floor(secNum / 3600);
        const minutes: number = Math.floor(secNum / 60) % 60;
        const seconds: number = secNum % 60;

        return [hours, minutes, seconds]
            .map((val) => (val < 10 ? `0${val}` : val))
            .filter((val, index) => val !== "00" || index > 0)
            .join(":")
            .replace(/^0/, "");
    };

    return (
        <div>
            {readOnly ?
                <input className="timer-input" type="text" onBlur={onBlur} value={value} readOnly />
                :
                <input className="timer-input" type="text" onChange={onChangeI} onBlur={onBlur} value={value} />
            }
        </div>

    );
}

export default TimerInput