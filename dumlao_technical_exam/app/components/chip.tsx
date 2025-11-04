interface chipProps {
    chipText: string
}

const Chip = ({chipText}: chipProps) => {
    // const [color, setColor] = useState("");
    let color = ""

    if (chipText === "Pending") {
        color = "bg-blue-200 border-blue-500"
    } else if (chipText === "Completed") {
        color = "bg-green-200 border-green-500"
    }

    return (
        <div className={`flex flex-col items-center p-[5px] rounded-2xl border-2 ${color}`}>
            <div className="text-[11px] font-bold text-center">
                {chipText}
            </div>
        </div>
)
}

export default Chip