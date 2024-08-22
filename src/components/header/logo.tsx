import {Space} from "@arco-design/web-react";
import {useHistory} from "react-router-dom";
import useRoute from "@/routes";
import {IUser, useUser} from "@/store/user";

const Logo = () => {
    const userPermission = useUser((state: IUser) => state.userPerms)

    const history = useHistory();
    const [permissionRoute, defaultRoute] = useRoute(userPermission);

    return (
        <Space style={{cursor: 'pointer', transform: 'translate(0, -1px)', marginLeft: '12px'}}>
            <img
                src={require('@/assets/logo.gif')}
                alt={"logo"}
                width={'36px'}
                height={'36px'}
                style={{position: 'absolute', transform: 'translate(0, -18px)'}}
                onClick={() => history.push(`/${defaultRoute}`)}
            />
            <div
                style={{marginLeft: '38px', marginRight: '12px'}}
                onClick={() => history.push(`/${defaultRoute}`)}
            >
                <span style={{fontSize: '18px', fontWeight: 1000, color: 'var(--color-text-2)'}}>
                    Ai Platform
                </span>
            </div>
        </Space>
    )
}

export default Logo