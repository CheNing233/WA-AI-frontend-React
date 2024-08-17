import {UserPermission} from "@/utils/authentication";

export const GuestPerm: UserPermission = {
    'wa.trial': ['*'],
    'user': ['login', 'register'],
}

export const UserPerm: UserPermission = {
    ...GuestPerm,
    'user': ['login', 'register', 'bindGithub', 'center'],
    'wa.workbench': ['txt2img', 'img2img', 'extra'],
    'article.self': ['edit', 'delete'],
}

export const AdminPerm: UserPermission = {
    ...UserPerm,
    'article.other': ['edit', 'delete'],
}