import {ReactNode} from "react";

export default function Layout({children}: { children: ReactNode }) {
    return (
        <div className="grid gap-8 grid-cols-3 h-full w-full">
            {children}
        </div>
    )
}
