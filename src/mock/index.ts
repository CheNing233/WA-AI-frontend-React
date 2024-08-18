/**
 * 根据配置进行模拟设置
 *
 * 此函数用于根据配置来决定是否执行模拟设置在开发环境中，默认情况下会执行模拟设置
 *
 * @param config 配置对象，包含是否启用模拟和设置函数
 */
const setupMock = (config: { mock?: boolean; setup: () => void }) => {
    // 解构配置对象，允许mock参数覆盖环境变量
    const {mock = process.env.NODE_ENV === 'development', setup} = config;

    // 如果mock配置为false，则不执行任何操作
    if (mock === false) return;

    // 执行设置函数，进行模拟设置
    setup();
}


export default setupMock