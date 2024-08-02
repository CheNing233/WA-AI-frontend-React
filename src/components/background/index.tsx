import "@/components/background/styles/index.css"

import {useContext} from "react";
import {GlobalContext} from '@/context';


const Index = () => {
    const {theme} = useContext(GlobalContext)

    return (
        <div className={"background-dots-plus" + (theme === 'dark' ? ' dark' : '')}/>
    )
}

export default Index