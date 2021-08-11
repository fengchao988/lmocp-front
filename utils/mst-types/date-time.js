import { types } from "mobx-state-tree";
import moment from "moment";

moment.locale('zh-cn');

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

const DateTime = types.custom({
    name: "DateTime",
    fromSnapshot: string => moment(string, DATE_FORMAT),
    toSnapshot: (mDate) => mDate.format(DATE_FORMAT),
    isTargetType: maybeMoment => moment.isMoment(maybeMoment),
    getValidationMessage: snapshot => {
        if (snapshot === undefined) return "";
        const mDate = moment(snapshot, DATE_FORMAT, true);
        if (!mDate.isValid()) {
            const message = `"${snapshot}" is not in valid date format ${DATE_FORMAT}`;
            console.error(message);
            return message;
        }
        return "";
    }
});

export default DateTime;