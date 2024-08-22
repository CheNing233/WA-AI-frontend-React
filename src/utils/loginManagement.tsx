import api from "@/services/export";
import {initialUserInfo, IUser, IUserInfo, useUser} from "@/store/user";
import eventbus from "@/eventbus";
import {useEffect} from "react";
import {AdminPerm, GuestPerm, UserPerm} from "@/constants/permissions";
import {Message} from "@arco-design/web-react";


const LoginManagement = () => {
    const [setUserLogged, setUserInfo, setUserPerms] = useUser(
        (state: IUser) => [state.setUserLogged, state.setUserInfo, state.setUserPerms]
    )
    // const [userLogged, userInfo, userPerms] = useUser(
    //     (state: IUser) => [state.userLogged, state.userInfo, state.userPerms]
    // )

    useEffect(() => {
        /**
         * 获取当前的登录状态
         * 此函数通过调用API检查用户是否已登录，并根据登录状态设置用户信息、权限等
         */
        const getLoginState = () => {
            // 调用API检查是否已登录
            api.account.isLogin()
                .then((isLoginRes) => {
                    // 如果已登录
                    if (isLoginRes.data.data) {
                        // 设置用户已登录状态为true
                        setUserLogged(true)
                        // 调用API获取用户权限
                        api.account.authTest()
                            .then((permRes) => {
                                if (permRes.data.data[0] === 'administrator') {
                                    setUserPerms(AdminPerm)
                                } else {
                                    setUserPerms(UserPerm)
                                }
                            })
                        // 调用API获取用户详细信息
                        api.account.info()
                            .then((infoRes) => {
                                // 处理并更新用户信息
                                let newUserInfo: IUserInfo = {...infoRes.data.data}
                                // 重置头像URL
                                newUserInfo.avatarUrl = null
                                // 如果用户信息和头像存在，获取头像URL
                                if (newUserInfo && newUserInfo.avatar) {
                                    // 通过头像ID获取头像URL
                                    api.staticImage.getUrlByStaticImageId(newUserInfo.avatar)
                                        .then((avatarRes) => {
                                            // 更新用户信息中的头像URL
                                            newUserInfo.avatarUrl = avatarRes.data.data.url
                                            // 设置用户信息
                                            setUserInfo(newUserInfo)
                                            Message.success(`欢迎回来，${newUserInfo.nickName}`)
                                        })
                                } else {
                                    // 如果不存在头像，直接设置用户信息
                                    setUserInfo(newUserInfo)
                                }
                            })
                    } else { // 如果未登录
                        // 设置用户已登录状态为false
                        setUserLogged(false)
                        // 设置用户权限为游客权限
                        setUserPerms(GuestPerm)
                        // 重置用户信息为初始状态
                        setUserInfo({...initialUserInfo})
                    }
                })
        }
        getLoginState()
        eventbus.on('user.getLoginState', getLoginState)
        return () => {
            eventbus.off('user.getLoginState', getLoginState)
        }
    }, [])

    return null
}

export default LoginManagement