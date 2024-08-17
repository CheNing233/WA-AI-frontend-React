import create from 'zustand'
import {GuestPerm} from "@/constants/permissions";
import {UserPermission} from "@/utils/authentication";

export type IUserInfo = {
    nickName: string;
    userName: string;
    avatar: string;
    email: string;
    gender: string;
    describe: string;
}

export type IUser = {
    userLogged: boolean;
    setUserLogged: (userLogged: boolean) => void;
    userInfo: IUserInfo;
    setUserInfo: (userInfo: IUserInfo) => void;
    userPerms: UserPermission;
    setUserPerms: (userPerms: UserPermission) => void;
}

export const useUser = create((set) => ({
    userLogged: false,
    setUserLogged: (userLogged: boolean) => set(() => ({userLogged})),
    userInfo: {
        nickName: '游客',
        userName: 'guest',
        avatar: null,
        email: null,
        gender: null,
        describe: null,
    },
    setUserInfo: (userInfo: IUserInfo) => set(() => ({userInfo})),
    userPerms: GuestPerm,
    setUserPerms: (userPerms: UserPermission) => set(() => ({userPerms})),
}))