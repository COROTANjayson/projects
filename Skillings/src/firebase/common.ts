import moment from "moment";
import { auth } from "./firebase";

const firebaseAdd = async (item: any) => {
    item.owner = auth.currentUser?.email;
    item.creation = moment().unix();
    item.modified = moment().unix();
    item.modifiedBy = auth.currentUser?.email;
    item.isDeleted = false;
    return item;
};

const firebaseUpdate = async (item: any) => {
    item.modified = moment().unix();
    item.modifiedBy = auth.currentUser?.email;
    return item;
};

export { firebaseAdd, firebaseUpdate };
