import defaultSettings from '../settings.json';

export interface GlobalState {
    settings?: typeof defaultSettings;
    userInfo?: {
        name?: string;
        avatar?: string;
        job?: string;
        organization?: string;
        location?: string;
        email?: string;
        permissions: Record<string, string[]>;
    };
    userLoading?: boolean;
    workbenchSetting?: {
        width: string | number | any;
        wrapperInDrawer: boolean;
    }
}

const initialState: GlobalState = {
    settings: defaultSettings,
    userInfo: {
        permissions: {},
    },
    workbenchSetting: {
        width: '100vw',
        wrapperInDrawer: true,
    }
};

export default function store(state = initialState, action: { type: string, payload: any }) {
    switch (action.type) {
        case 'update-settings': {
            const {settings} = action.payload;
            return {
                ...state,
                settings,
            };
        }
        case 'update-userInfo': {
            const {userInfo = initialState.userInfo, userLoading} = action.payload;
            return {
                ...state,
                userLoading,
                userInfo,
            };
        }
        case 'update-workbenchSetting': {
            const {workbenchSetting} = action.payload;
            return {
                ...state,
                workbenchSetting,
            }
        }
        default:
            return state;
    }
}
