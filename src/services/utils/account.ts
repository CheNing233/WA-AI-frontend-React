import {IUserInfo} from "@/store/user";
import api from "@/services/export";
import {loadingMessage} from "@/utils/loadingMessage";

export const getUserAvatar = (userInfo: IUserInfo, callbackFn: (userInfo: IUserInfo) => void) => {
    userInfo.avatarUrl = null

    if (userInfo && userInfo.avatar) {
        // 通过头像ID获取头像URL
        api.staticImage.getUrlByStaticImageId(userInfo.avatar)
            .then((avatarRes) => {
                // 更新用户信息中的头像URL
                userInfo.avatarUrl = avatarRes.data.data.url
                // 设置用户信息
                callbackFn(userInfo)
            })
    } else {
        callbackFn(userInfo)
    }
}

export const getEmailCode = (email: string, type: 'register' | 'forgetPassword', setCooldownFunc: any) => {
    setCooldownFunc(60);
    loadingMessage(
        'msg.sendEmailCode',
        '正在发送...',
        (resolve) => {
            // 调用API进行登录
            api.account.sendEmailCode(email, type)
                .then((result) => {
                    if (result.data.code === 200) {
                        resolve(true, '验证码发送成功')
                    } else {
                        resolve(false, `验证码发送失败：${result.data.errorMsg}`)
                    }
                })
                .catch((error) => {
                    // 登录失败提示错误信息
                    resolve(false, `验证码发送失败：${error.message}`)
                })
                .finally(() => {
                    // 使用函数式更新，确保使用最新的 state
                    const interval = setInterval(() => {
                        setCooldownFunc((prevCooldown) => {
                            if (prevCooldown <= 1) {
                                clearInterval(interval);  // 清除倒计时
                                return 0;  // 设置为 0 表示冷却结束
                            }
                            return prevCooldown - 1;  // 递减倒计时
                        });
                    }, 1000);
                })
        }
    )
}
