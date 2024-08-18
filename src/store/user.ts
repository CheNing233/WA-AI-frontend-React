import {create} from 'zustand'
import {GuestPerm} from "@/constants/permissions";
import {UserPermission} from "@/utils/authentication";

export type IUserInfo = {
    id: number,
    nickName: string;
    userName: string;
    avatar: string;
    avatarUrl?: string;
    email: string;
    gender: string;
    describe: string | null;
    calculationPoint: any,
    githubId: number | null
}

export type IUser = {
    userLogged: boolean;
    setUserLogged: (userLogged: boolean) => void;
    userInfo: IUserInfo;
    setUserInfo: (userInfo: IUserInfo) => void;
    userPerms: UserPermission;
    setUserPerms: (userPerms: UserPermission) => void;
    getLogin: () => void
}

export const initialUserInfo = {
    id: null,
    nickName: '游客',
    userName: 'guest',
    avatar: null,
    avatarUrl: null,
    email: null,
    gender: null,
    describe: null,
    calculationPoint: null,
    githubId: null
}

export const useUser = create((set, getState) => ({
    userLogged: false,
    setUserLogged: (userLogged: boolean) => set(() => ({userLogged})),
    userInfo: {
        ...initialUserInfo
    },
    setUserInfo: (userInfo: IUserInfo) => set(() => ({userInfo})),
    userPerms: GuestPerm,
    setUserPerms: (userPerms: UserPermission) => set(() => ({userPerms})),
}))