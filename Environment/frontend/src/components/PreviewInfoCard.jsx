import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useMap } from 'react-leaflet';

const PreviewInfoCard = ({ structure, structureName, structureDescription, structureTags, onClose }) => {

    const map = useMap();
    const cardRef = useRef(null);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const closeBtn = closeBtnRef.current;

        const handleFocus = () => map.scrollWheelZoom.disable();
        const handleBlur = () => map.scrollWheelZoom.enable();

        if (card) {
            card.addEventListener("mouseenter", handleFocus);
            card.addEventListener("mouseleave", handleBlur);
        }

        closeBtn.addEventListener("click", handleBlur);

        return () => {
        if (card) {
            card.removeEventListener("mouseenter", handleFocus);
            card.removeEventListener("mouseleave", handleBlur);
        }
        };
    }, [map]);
    
    return (
        <>
            <div className="fixed h-screen w-screen z-50 bg-black/40 flex items-center justify-center">
                <div className="card bg-base-100 w-100 shadow-sm m-2 z-9999 h-auto cursor-default"
                ref={cardRef}
                tabIndex={0}>
                    <div className="card-body flex flex-col justify-between gap-8">

                        <div className='flex flex-col gap-6'>
                            {/* Structure name - read only */}
                            <div className="flex flex-col w-full gap-3">
                                <label className='font-bold'>Name:</label>
                                <div className="w-full pointer-events-none flex flex-col gap-3">
                                    <span className='font-bold text-xl'>{structureName}</span>
                                    {structure.structureType &&
                                        <span className="badge badge-soft">{structure.structureType}</span>
                                    }
                                </div>
                            </div>

                            {/* Tags - read only */}
                            {(structureTags && structureTags.length > 0) &&
                                <div className='flex flex-col gap-3'>
                                    <label className='font-bold'>Tags:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {
                                            structureTags.map((tag) => (
                                                <div key={tag} className="badge badge-outline">
                                                    {tag}
                                                </div>
                                            ))
                                       }
                                    </div>
                                </div>
                            }

                            {/* Description - read only */}
                            {structureDescription &&
                                <div className='flex flex-col gap-2'>
                                    <label className='font-bold'>Description:</label>
                                    <div className="w-full bg-base-200 border pointer-events-none p-3 rounded"
                                        style={{resize: 'none'}}>
                                        <span>{structureDescription}</span>
                                    </div>
                                </div>
                            }
                        </div>

                        {/* Close button */}
                        <div>
                            <div className="card-actions justify-end">
                                <button ref={closeBtnRef} className="btn btn-sm btn-soft" onClick={onClose}>
                                    <X size={16} />
                                    Close
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default PreviewInfoCard;
