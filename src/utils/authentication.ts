/**
 * 鉴定某资源的某操作，检查 actions === perm
 * 此函数检查actions数组中的每个操作是否都在权限数组perm中存在
 * 或perm是否全为通配符"*"，表示全部允许。若perm为空则直接返回假。
 * @param actions 用户要执行的操作数组
 * @param perm 资源的权限数组，如果权限数组中包含通配符'*'，则表示允许所有操作
 * @returns 如果所有操作都属于权限数组中的权限，则返回true，否则返回false
 */
const judge = (actions: string[], perm: string[]) => {
    if (!perm || !perm.length) {
        return false;
    }

    if (perm.join('') === '*') {
        return true;
    }

    return actions.every((action) => perm.includes(action));
};


/**
 * 定义认证信息类型，包含资源和操作
 */
type Auth = {
    resource: string | RegExp; // 资源可以是字符串或正则表达式，用于匹配资源名称
    actions?: string[]; // 可选的操作数组，用于指定具体操作权限
};

/**
 * 定义用户权限类型，key为资源名称，value为该资源允许的操作数组
 */
export type UserPermission = Record<string, string[]>;


/**
 * 对单个资源鉴权，对 Auth（资源和操作），检查是否符合 userPermission
 * @param params 认证信息，包含资源和操作
 * @param userPermission 用户权限信息
 * @returns 如果用户有权执行所有指定的操作，则返回true，否则返回false
 */
const auth = (params: Auth, userPermission: UserPermission) => {
    const {resource, actions = []} = params;

    if (resource instanceof RegExp) {
        const permKeys = Object.keys(userPermission);
        const matchPermissions = permKeys.filter((item) => item.match(resource));
        if (!matchPermissions.length) {
            return false;
        }
        return matchPermissions.every((key) => {
            const perm = userPermission[key];
            return judge(actions, perm);
        });
    }

    const perm = userPermission[resource];
    return judge(actions, perm);
};


/**
 * 定义认证参数接口，用于指定用户鉴权所需的权限信息
 */
export interface AuthParams {
    requiredPermissions?: Array<Auth>; // 可选的权限数组，用于指定用户必须具有的权限
    oneOfPerm?: boolean; // 可选的布尔值，用于指定是否只需要一个权限匹配即可
}

/**
 * 对多个资源鉴权，对 AuthParams（多个资源和操作），检查是否符合 userPermission
 * @param params 认证参数，包含用户必须具有的权限信息
 * @param userPermission 用户权限信息
 * @returns 如果用户权限满足认证参数的要求，则返回true，否则返回false
 */
const authParams = (params: AuthParams, userPermission: UserPermission) => {
    const {requiredPermissions, oneOfPerm} = params;
    if (Array.isArray(requiredPermissions) && requiredPermissions.length) {
        let count = 0;
        for (const rp of requiredPermissions) {
            if (auth(rp, userPermission)) {
                count++;
            }
        }
        return oneOfPerm ? count > 0 : count === requiredPermissions.length;
    }
    return true;
}

export default authParams