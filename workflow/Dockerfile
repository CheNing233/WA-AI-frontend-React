# 使用 Node.js latest 镜像作为基础映像
FROM node:latest

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json（如果存在）到工作目录
# COPY package.json package-lock.json ./

# 安装依赖
# RUN npm install

# 复制 React npm build 项目到工作目录
COPY build/ ./build

# 将主机的 6667 端口映射到容器的 16666 端口
EXPOSE 16666

# 设置 Node.js 监听 16666 端口
CMD ["node", "build/index.js", "16666"]