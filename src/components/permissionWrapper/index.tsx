import React, {useMemo} from 'react';
import authentication, {AuthParams} from '@/utils/authentication';
import {IUser, useUser} from "@/store/user";

/**
 * 权限控制组件的属性
 * @extends AuthParams 权限验证参数
 * @property {React.ReactNode} backup? 备份节点，无权限时显示
 */
type PermissionWrapperProps = {
    backup?: React.ReactNode;
    required?: AuthParams;
};

/**
 * 权限控制组件
 * 该组件用于根据用户权限来控制组件的显示与隐藏
 * @param {React.PropsWithChildren<PermissionWrapperProps>} props 组件属性
 * @returns {React.ReactElement | null} 根据权限返回子组件或备份节点，无权限返回null
 */
const PermissionWrapper = (
    props: React.PropsWithChildren<PermissionWrapperProps>
): React.ReactElement | null => {
    // 解构组件属性
    const {backup, required} = props;
    // 从store中选择用户权限
    const userPerms = useUser((state: IUser) => state.userPerms)

    // 使用useMemo钩子计算用户是否具有所需的权限
    const hasPermission = useMemo(() => {
        return authentication(
            required,
            userPerms
        );
    }, [required, userPerms]);

    // 根据权限情况返回不同的节点
    if (hasPermission) {
        return <>{convertReactElement(props.children)}</>;
    }
    if (backup) {
        return <>{convertReactElement(backup)}</>;
    }
    return null;
};

/**
 * 将可能的React节点转换为React元素
 * 主要用于确保传入的子节点或备份节点能够被React正确渲染
 * @param {React.ReactNode} node 可能的React节点
 * @returns {React.ReactElement} 转换后的React元素
 */
function convertReactElement(node: React.ReactNode): React.ReactElement {
    if (!React.isValidElement(node)) {
        return <>{node}</>;
    }
    return node;
}

// 导出权限控制组件
export default PermissionWrapper;
