interface IGetQiniuImageWithParamsRes {
    imageUrl: string,
    width?: number,
    height?: number,
    quality?: number,
    format?: 'webp' | 'png' | 'jpeg'
}

export const getQiniuImageWithParams = (
    {imageUrl, width, height, format, quality}: IGetQiniuImageWithParamsRes
) => {
    const baseParam = 'imageMogr2/auto-orient'

    let size = '/thumbnail/1024x1024>'
    if (width && height) {
        size = `/thumbnail/${width}x${height}>`
    }

    let formatParam = '/format/webp'
    if (format) {
        formatParam = `/format/${format}`
    }

    let qualityParam = '/format/75'
    if (quality) {
        qualityParam = `/quality/${quality}`
    }

    return `${imageUrl}?${baseParam}${size}${formatParam}/blur/1x0${qualityParam}`
};