export function InputBox({label , placeholder , onChange}){
    return(
        <div>
            <div className="text-xl font-medium text-left py-2">
                {label}
            </div>
            <div >
                <input onChange={onChange} type="text" placeholder={placeholder} className="w-full text-2xl px-2 py-1 border rounded border-slate-200" />
            </div>
        </div>
    )
}