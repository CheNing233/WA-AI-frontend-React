import {ITask, TaskStatus} from "@/services/modules/tasks";
import api from "@/services/export";


export const getTaskBannerUrl = (newTask: ITask) => {
    return new Promise((resolve, reject) => {
        api.staticImage.getUrlByStaticImageId(newTask.imageId)
            .then((urlRes) => {
                newTask.bannerUrl = urlRes.data.data.url
                resolve(newTask)
            })
    })
}


export const getTasksExtraInfo = (
    tasks: ITask[],
    callbackFn: (tasks: ITask[]) => void
) => {

    const getExtraInfo = (task: ITask) => {
        let newTask = task

        return new Promise((resolve) => {
            Promise.all([getTaskBannerUrl(newTask)])
                .finally(() => {
                    resolve(newTask)
                })
        })
    }

    const getStatusKey = (enumObj: any, value: number) => {
        return Object.keys(enumObj).find(key => enumObj[key] === value) || '';
    }


    let newTasks = tasks
    let promiseList = []

    if (newTasks.length !== 0) {
        newTasks.forEach((task, index) => {
            promiseList.push(new Promise((resolve) => {
                getExtraInfo(task)
                    .then((newTask) => {

                        newTask['statusText'] = getStatusKey(TaskStatus, task.status)

                        newTasks[index] = newTask
                        resolve(null)
                    })
            }))
        })

        Promise.all(promiseList)
            .finally(() => {
                callbackFn(newTasks)
            })

        return null
    }
}

export const convertTask2Post = (task: ITask) => {
    return {
        id: task.id,
        title: `${task.id}`,
        userId: task.userId,
        userNickName: task.nickName,
        updateTime: task.updateTime,
        sdimageIdList: [task.imageId],

        favours: false,
        numFavours: 0,
        liked: false,
        numLiked: 0,
        numComment: 0,

        bannerUrl: task.bannerUrl || null,
    }
}