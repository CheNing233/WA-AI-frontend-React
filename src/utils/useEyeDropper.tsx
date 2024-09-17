import {useCallback, useMemo, useState} from "react";

type EyeDropper = {
    open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string | undefined }>;
};

function useEyeDropper(
    init?: string,
): [
    state: { canUse: boolean; color: string },
    action: (signal?: AbortSignal | undefined) => Promise<string | undefined>,
] {
    const canUse = useMemo(function () {
        return Object.prototype.hasOwnProperty.call(window, 'EyeDropper');
    }, []);
    const [color, setColor] = useState(init ?? '');

    const open = useCallback(
        async function (signal?: AbortSignal) {
            if (!canUse) return;

            const eyeDropper: EyeDropper = new (window as any).EyeDropper();

            const res = await eyeDropper.open({ signal });
            res.sRGBHex && setColor(res.sRGBHex);

            return res.sRGBHex;
        },
        [canUse],
    );

    return [{ canUse, color }, open];
}

export default useEyeDropper;