const TileMapButton = ({ name, Icon, bgColor, iconColor, tagType, border, onClick, structureType }) => {

    return (
        <button className="flex gap-4" 
        onClick={() => 
            onClick({
                name: name, 
                Icon: Icon, 
                bgColor: bgColor, 
                iconColor: iconColor, 
                border: border, 
                tagType: tagType, 
                structureType: structureType
            }
        )}>
            {Icon && (
                <div className={`flex justify-center items-center p-2 rounded-full ${border}`} style={{ backgroundColor: bgColor }}>
                    <Icon size={18} className={`${iconColor}`} />
                </div>
            )}
            <span className="text-md">{name}</span>
        </button>
    );
};

export default TileMapButton;