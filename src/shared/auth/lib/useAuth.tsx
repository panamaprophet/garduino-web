import { useContext } from "react";
import { Context } from "./context";

export const useAuth = () => {
    const context = useContext(Context);

    if (!context) {
        throw Error('[auth] no context provider found');
    }

    return {
        ...context,
    };
};
