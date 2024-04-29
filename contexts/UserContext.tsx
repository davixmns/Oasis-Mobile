import {createContext} from "react";
import {ProviderProps} from "../interfaces/interfaces";

export interface UserContextType {

}

const UserContext = createContext<UserContextType>({} as UserContextType)

export function UserProvider({children}: ProviderProps) {

    return (
        <UserContext.Provider
            value={{

            }}
        >
            {children}
        </UserContext.Provider>
    );
}