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

    let size = ''
    if (width && height) {
        size = `/thumbnail/${width}x${height}>`
    }

    let formatParam = 'webp'
    if (format !== null) {
        formatParam = `/format/${format}`
    }

    let qualityParam = '75'
    if (quality !== null) {
        qualityParam = `/quality/${quality}`
    }

    return `${imageUrl}?${baseParam}${size}${formatParam}/blur/1x0${qualityParam}`
};