import {IWorkbenchModel} from "@/store/workbench";

export const packParams = (
    rawParams: any,
    rawCheckpoint: IWorkbenchModel,
    rawVae: IWorkbenchModel,
    rawExtraModels: IWorkbenchModel[]
) => {
    let loraPrompt = '';
    let loraNegativePrompt = '';
    let embeddingPrompt = '';
    let embeddingNegativePrompt = '';

    rawExtraModels.forEach(model => {
        switch (model.type) {
            case 'LORA':
                if (model.asNegative)
                    loraNegativePrompt += `, <lora:${model.filename}:${model.weight}>`
                else
                    loraPrompt += `, <lora:${model.filename}:${model.weight}>`
                return
            case 'EMBEDDING':
                if (model.asNegative)
                    embeddingNegativePrompt += `, (${model.filename}:${model.weight})`
                else
                    embeddingPrompt += `, (${model.filename}:${model.weight})`
        }
    })

    return {
        ...rawParams,
        prompt: `${rawParams.prompt}${loraPrompt}${embeddingPrompt}`,
        negative_prompt: `${rawParams.negative_prompt}${loraNegativePrompt}${embeddingNegativePrompt}`,
        override_settings: {
            ...rawParams.override_settings,
            sd_model_checkpoint: rawCheckpoint.filename,
            sd_vae: rawVae.filename
        }
    }
}