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