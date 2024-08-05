import lazyLoad from "@/utils/lazyload";
import {useEffect, useMemo, useState} from "react";

export type IRoute = {
    name: string;
    key: string;
    // 当前页是否展示面包屑
    breadcrumb?: boolean;
    children?: IRoute[];
    // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
    ignore?: boolean;
    // 已渲染的组件
    component?: any;
    // 当前路由需要权限才能访问
    requiredPermissions?: string[];
    // 当前路由需要权限中的一个或多个才能访问
    oneOfPerm?: string[];
};

export const routes: IRoute[] = [
    {
        name: 'menu.home',
        key: 'home',
    },
    {
        name: 'menu.models',
        key: 'models',
    },
    {
        name: 'menu.prompts',
        key: 'prompts',
    },
    {
        name: 'menu.about',
        key: 'about',
    },
    {
        name: 'menu.dashboard',
        key: 'dashboard',
        ignore: true
    },
    {
        name: 'menu.login',
        key: 'login',
        ignore: true,
    },
]

/**
 * 将路由树中的有效路由转换为平铺的路由数组
 * 有效路由指的是有路径的路由，且不包含需要忽略的子路由
 * 如果路由的组件未被动态加载，将会尝试使用lazyLoad函数动态加载
 *
 * @param routes 路由树数组，每个元素代表一个路由
 * @returns 返回平铺后的路由数组
 */
export const getFlattenRoutes = (routes: IRoute[]) => {
    // 定义一个空数组，用于存储平铺后的路由
    const res = [];

    /**
     * 遍历路由树，将有效路由添加到结果数组中
     * 有效路由是指有路径且不包含需要忽略的子路由的路由
     * 如果路由有子路由，会递归遍历子路由
     *
     * @param _routes 路由数组，每个元素代表一个路由
     */
    const travel = (_routes: IRoute[]) => {
        // 遍历路由数组中的每个路由
        _routes.forEach((route) => {
            // 获取可见的子路由，即不被忽略的子路由
            const visibleChildren = (route.children || []).filter(
                (child) => !child.ignore
            );
            // 如果路由有路径且没有子路由或者没有可见的子路由，则尝试动态加载组件并添加到结果数组
            if (route.key && (!route.children || !visibleChildren.length)) {
                try {
                    // 使用lazyLoad函数动态加载路由的组件
                    route.component = lazyLoad(() => import(`./pages/${route.key}/index.tsx`));
                    // 将路由添加到结果数组
                    res.push(route);
                } catch (e) {
                    // 如果动态加载组件失败，打印错误信息
                    console.error(e);
                }
            }
            // 如果路由有子路由，则递归遍历子路由
            if (route.children && route.children.length) {
                travel(route.children);
            }
        });
    }

    // 从根路由开始遍历
    travel(routes);
    // 返回平铺后的路由数组
    return res;
}

/**
 * 根据用户权限筛选路由
 *
 * 该函数接收一个可选的用户权限数组，返回一个处理后的路由数组和默认路由字符串
 * 主要逻辑是过滤掉用户没有权限访问的路由，并为每个有子路由的路由移除子路由
 *
 * @param userPermission 用户权限数组，用于确定用户可以访问哪些路由
 * @returns 返回一个元组，包含处理后的路由数组和默认路由字符串
 */
const useRoute = (userPermission?: string[]): [IRoute[], string] => {
    /**
     * 路由过滤函数
     *
     * 该函数递归地过滤路由数组，移除用户无权限访问的路由，并移除所有路由的子路由
     *
     * @param routes 待过滤的路由数组
     * @param arr 用于累积已过滤路由的数组
     * @returns 返回过滤后的路由数组
     */
    const filterRoute = (routes: IRoute[], arr = []): IRoute[] => {
        // 如果路由数组为空，直接返回空数组
        if (!routes.length) {
            return [];
        }
        // 遍历路由数组
        for (const route of routes) {
            // 判断路由是否有子路由
            if (route.children && route.children.length) {
                // 创建一个新的路由对象，清空其子路由
                const newRoute = {...route, children: []};
                // 递归过滤子路由，并将结果累积到新数组中
                filterRoute(route.children, newRoute.children);
                // 如果新路由的子路由数组不为空，则将其添加到累积数组中
                if (newRoute.children.length) {
                    arr.push(newRoute);
                }
            } else {
                // 如果路由没有子路由，直接将其添加到累积数组中
                arr.push({...route});
            }
        }
        // 返回累积数组
        return arr;
    };

    // 使用useState钩子保存过滤后的路由
    const [permissionRoute, setPermissionRoute] = useState(routes);

    // 使用useEffect钩子在用户权限变化时重新计算过滤后的路由
    useEffect(() => {
        const newRoutes = filterRoute(routes);
        setPermissionRoute(newRoutes);
    }, [JSON.stringify(userPermission)]);

    // 使用useMemo钩子计算默认路由
    const defaultRoute = useMemo(() => {
        // 获取第一个路由
        const first = permissionRoute[0];
        // 如果第一个路由存在，则返回其子路由的第一个路由的key，如果不存在，则返回其自身的key
        if (first) {
            return first?.children?.[0]?.key || first.key;
        }
        // 如果没有路由，返回空字符串
        return '';
    }, [permissionRoute]);

    // 返回处理后的路由数组和默认路由字符串
    return [permissionRoute, defaultRoute];
};


export default useRoute;