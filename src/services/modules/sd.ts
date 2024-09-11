import request from "@/services";
import {AxiosResponse} from "axios";

// 参数接口
export interface Txt2ImageParams {
    /* */
    txt2ImageOptions?: {
        /* */
        enable_hr?: boolean;

        /* */
        denoising_strength?: number;

        /* */
        firstphase_width?: Record<string, unknown>;

        /* */
        firstphase_height?: Record<string, unknown>;

        /* */
        hr_scale?: Record<string, unknown>;

        /* */
        hr_upscaler?: string;

        /* */
        hr_second_pass_steps?: Record<string, unknown>;

        /* */
        hr_resize_x?: Record<string, unknown>;

        /* */
        hr_resize_y?: Record<string, unknown>;

        /* */
        prompt?: string;

        /* */
        styles?: Record<string, unknown>[];

        /* */
        seed?: Record<string, unknown>;

        /* */
        subseed?: Record<string, unknown>;

        /* */
        subseed_strength?: number;

        /* */
        seed_resize_from_h?: Record<string, unknown>;

        /* */
        seed_resize_from_w?: Record<string, unknown>;

        /* */
        sampler_name?: string;

        /* */
        batch_size?: Record<string, unknown>;

        /* */
        n_iter?: Record<string, unknown>;

        /* */
        steps?: Record<string, unknown>;

        /* */
        cfg_scale?: number;

        /* */
        width?: Record<string, unknown>;

        /* */
        height?: Record<string, unknown>;

        /* */
        restore_faces?: boolean;

        /* */
        tiling?: boolean;

        /* */
        do_not_save_samples?: boolean;

        /* */
        do_not_save_grid?: boolean;

        /* */
        negative_prompt?: string;

        /* */
        eta?: number;

        /* */
        s_churn?: Record<string, unknown>;

        /* */
        s_tmax?: Record<string, unknown>;

        /* */
        s_tmin?: Record<string, unknown>;

        /* */
        s_noise?: Record<string, unknown>;

        /* */
        override_settings?: Record<string, unknown>;

        /* */
        override_settings_restore_afterwards?: boolean;

        /* */
        script_args?: Record<string, unknown>[];

        /* */
        script_name?: string;

        /* */
        send_images?: boolean;

        /* */
        save_images?: boolean;

        /* */
        alwayson_scripts?: Record<string, unknown>;

        /* */
        sampler_index?: string;

        /* */
        use_deprecated_controlnet?: boolean;
    };

    /* */
    count?: number;
}

// 响应接口
export interface Txt2ImageRes {
    /* */
    success: boolean;

    /* */
    code: number;

    /* */
    errorMsg: string;

    /* */
    data: Record<string, unknown>;

    /* */
    total: number;
}

/**
 * txt2Image
 * @param {object} params Txt2ImageDTO
 * @param {object} params.txt2ImageOptions
 * @param {number} params.count
 * @returns
 */
export function txt2Image(params: Txt2ImageParams): Promise<AxiosResponse<Txt2ImageRes>> {
    return request.post(`/drawImage/txt2Image`, params);
}


// 参数接口
export interface Img2imgParams {
    /* */
    prompt?: string;

    /* */
    negative_prompt?: string;

    /* */
    styles?: Record<string, unknown>[];

    /* */
    seed?: number;

    /* */
    subseed?: number;

    /* */
    subseed_strength?: number;

    /* */
    seed_resize_from_h?: number;

    /* */
    seed_resize_from_w?: number;

    /* */
    sampler_name?: string;

    /* */
    batch_size?: number;

    /* */
    n_iter?: number;

    /* */
    steps?: number;

    /* */
    cfg_scale?: Record<string, unknown>;

    /* */
    width?: number;

    /* */
    height?: number;

    /* */
    restore_faces?: boolean;

    /* */
    tiling?: boolean;

    /* */
    do_not_save_samples?: boolean;

    /* */
    do_not_save_grid?: boolean;

    /* */
    eta?: number;

    /* */
    denoising_strength?: Record<string, unknown>;

    /* */
    s_min_uncond?: number;

    /* */
    s_churn?: number;

    /* */
    s_tmax?: number;

    /* */
    s_tmin?: number;

    /* */
    s_noise?: number;

    /* */
    override_settings?: Record<string, unknown>;

    /* */
    override_settings_restore_afterwards?: boolean;

    /* */
    refiner_checkpoint?: string;

    /* */
    refiner_switch_at?: number;

    /* */
    disable_extra_networks?: boolean;

    /* */
    comments?: Record<string, unknown>;

    /* */
    init_images?: Record<string, unknown>[];

    /* */
    resize_mode?: number;

    /* */
    image_cfg_scale?: number;

    /* */
    mask?: string;

    /* */
    mask_blur_x?: number;

    /* */
    mask_blur_y?: number;

    /* */
    mask_blur?: number;

    /* */
    mask_round?: boolean;

    /* */
    inpainting_fill?: number;

    /* */
    inpaint_full_res?: boolean;

    /* */
    inpaint_full_res_padding?: number;

    /* */
    inpainting_mask_invert?: number;

    /* */
    initial_noise_multiplier?: number;

    /* */
    latent_mask?: string;

    /* */
    sampler_index?: string;

    /* */
    include_init_images?: boolean;

    /* */
    script_name?: string;

    /* */
    script_args?: Record<string, unknown>[];

    /* */
    send_images?: boolean;

    /* */
    save_images?: boolean;

    /* */
    alwayson_scripts?: Record<string, unknown>;

    /* */
    infotext?: string;

    /* */
    firstpass_image?: string;

    /* */
    force_task_id?: string;

    /* */
    scheduler?: string;
}

// 响应接口
export interface Img2imgRes {
    /* */
    success: boolean;

    /* */
    code: number;

    /* */
    errorMsg: string;

    /* */
    data: Record<string, unknown>;

    /* */
    total: number;
}

/**
 * img2img
 * @param {object} params Image2ImageOptions
 * @param {string} params.prompt
 * @param {string} params.negative_prompt
 * @param {array} params.styles
 * @param {number} params.seed
 * @param {number} params.subseed
 * @param {number} params.subseed_strength
 * @param {number} params.seed_resize_from_h
 * @param {number} params.seed_resize_from_w
 * @param {string} params.sampler_name
 * @param {number} params.batch_size
 * @param {number} params.n_iter
 * @param {number} params.steps
 * @param {object} params.cfg_scale
 * @param {number} params.width
 * @param {number} params.height
 * @param {boolean} params.restore_faces
 * @param {boolean} params.tiling
 * @param {boolean} params.do_not_save_samples
 * @param {boolean} params.do_not_save_grid
 * @param {number} params.eta
 * @param {object} params.denoising_strength
 * @param {number} params.s_min_uncond
 * @param {number} params.s_churn
 * @param {number} params.s_tmax
 * @param {number} params.s_tmin
 * @param {number} params.s_noise
 * @param {object} params.override_settings
 * @param {boolean} params.override_settings_restore_afterwards
 * @param {string} params.refiner_checkpoint
 * @param {number} params.refiner_switch_at
 * @param {boolean} params.disable_extra_networks
 * @param {object} params.comments
 * @param {array} params.init_images
 * @param {number} params.resize_mode
 * @param {number} params.image_cfg_scale
 * @param {string} params.mask
 * @param {number} params.mask_blur_x
 * @param {number} params.mask_blur_y
 * @param {number} params.mask_blur
 * @param {boolean} params.mask_round
 * @param {number} params.inpainting_fill
 * @param {boolean} params.inpaint_full_res
 * @param {number} params.inpaint_full_res_padding
 * @param {number} params.inpainting_mask_invert
 * @param {number} params.initial_noise_multiplier
 * @param {string} params.latent_mask
 * @param {string} params.sampler_index
 * @param {boolean} params.include_init_images
 * @param {string} params.script_name
 * @param {array} params.script_args
 * @param {boolean} params.send_images
 * @param {boolean} params.save_images
 * @param {object} params.alwayson_scripts
 * @param {string} params.infotext
 * @param {string} params.firstpass_image
 * @param {string} params.force_task_id
 * @param {string} params.scheduler
 * @returns
 */
export function img2img(params: Img2imgParams): Promise<AxiosResponse<Img2imgRes>> {
    return request.post(`/drawImage/img2img`, params);
}


// 参数接口
export interface ExtraImageParams {
    /* */
    codeformer_visibility?: Record<string, unknown>;

    /* */
    codeformer_weight?: Record<string, unknown>;

    /* */
    extras_upscaler_2_visibility?: Record<string, unknown>;

    /* */
    gfpgan_visibility?: Record<string, unknown>;

    /* */
    image?: string;

    /* */
    resize_mode?: number;

    /* */
    show_results?: boolean;

    /* */
    upscale_first?: boolean;

    /* */
    upscaler_1?: string;

    /* */
    upscaler_2?: string;

    /* */
    upscaling_crop?: boolean;

    /* */
    upscaling_resize?: Record<string, unknown>;

    /* */
    upscaling_resize_h?: number;

    /* */
    upscaling_resize_w?: number;
}

// 响应接口
export interface ExtraImageRes {
    /* */
    success: boolean;

    /* */
    code: number;

    /* */
    errorMsg: string;

    /* */
    data: Record<string, unknown>;

    /* */
    total: number;
}

/**
 * extraImage
 * @param {object} params ExtraImageOptions
 * @param {object} params.codeformer_visibility
 * @param {object} params.codeformer_weight
 * @param {object} params.extras_upscaler_2_visibility
 * @param {object} params.gfpgan_visibility
 * @param {string} params.image
 * @param {number} params.resize_mode
 * @param {boolean} params.show_results
 * @param {boolean} params.upscale_first
 * @param {string} params.upscaler_1
 * @param {string} params.upscaler_2
 * @param {boolean} params.upscaling_crop
 * @param {object} params.upscaling_resize
 * @param {number} params.upscaling_resize_h
 * @param {number} params.upscaling_resize_w
 * @returns
 */
export function extraImage(params: ExtraImageParams): Promise<AxiosResponse<ExtraImageRes>> {
    return request.post(`/drawImage/extraImage`, params);
}