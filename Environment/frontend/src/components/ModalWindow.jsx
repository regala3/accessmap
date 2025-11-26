import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Trash2, FileDown } from 'lucide-react';

/**
 * @param {*} open bool for whether ModalWindow displays or not
 * @param {*} onClose function to set open false
 * @param {*} type string for type of modal window (e.g. deleteEvent, exportStalls)
 * @param {*} action function associated with modal window (e.g. delete, export)
 * @param {*} input string for additional modal window text (e.g. event name, stall count)
 * example of implementation with button in StallsPage.jsx:
 * onClick={() => setShowModal({
        open: true,
        type: "deleteStalls",
        action: () => {deleteStalls(selectedIds), setShowModal({...showModal, open: false})},
        input: selectedIds.length
    })}
 */
const ModalWindow = ({ open, onClose, type, action, input }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;

        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    let title = "";
    let text = "";
    let actionBtn = "";
    let actionBtnText = "";
    let actionBtnTheme = ""

    switch(type) {
        // saveMap is special case; needs three buttons
        case "saveMap": {
            title = "Save Map Changes";

            text = "Save changes to your map and return to dashboard?"

            return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
                <div className="bg-base-200 p-6 rounded-md shadow-lg z-10 w-100">
                    <h2 className="text-lg font-bold mb-4 text-center text-base-content">{title}</h2>
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative text-center inline-flex items-center justify-center">
                                <span className="text-base text-base-content">{text}</span>
                            </div>
                        </div>

                    <div className="flex gap-2 mt-6">
                        <button to={input} className={"btn btn-accent flex-1"} 
                            onClick={async (e) => {
                                await action(e);
                                onClose();
                                navigate(input);
                        }}>
                            <span>Save</span>
                        </button>

                        <Link to={input} className={"btn btn-primary flex-1"} onClick={onClose}>
                            <span className="text-md text-primary-content">Don't Save</span>
                        </Link>
                        
                        <button className="btn btn-primary btn-outline flex-1" onClick={onClose}>Cancel</button>
                    </div>
                    
                </div>
            </div>
        );

            break;
        }
        case "deleteEvent": {
            title = "Delete " + input;

            text = "Are you sure you want to delete this event? This action cannot be undone."

            actionBtn = (
                <span>
                    <button className="btn btn-error flex-1" onClick={action}>
                        <Trash2 size={16}/>
                        <span>Delete Event</span>
                    </button>
                </span>
            );
            
            break;
        }
        case "deleteStalls": {
            title = "Delete Selected Stalls";

            if (input == 1)
                text = "Are you sure you want to delete " + input + " stall? This action cannot be undone."
            else
                text = "Are you sure you want to delete " + input + " stalls? This action cannot be undone."

            actionBtn = (
                <span>
                    <button className="btn btn-error flex-1" onClick={action}>
                        <Trash2 size={16}/>
                        <span>Delete Stalls</span>
                    </button>
                </span>
            );

            break;
        }
        case "exportStalls": {
            title = "Export Stalls to Excel";
            text = "Export the selected stalls data to an Excel spreadsheet (.xlsx)?"

            actionBtn = (
                <span>
                    <button className="btn btn-primary flex-1" onClick={action}>
                        <FileDown size={16}/>
                        <span>Export Stalls</span>
                    </button>
                </span>
            );

            break;
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
            <div className="bg-base-200 p-6 rounded-md shadow-lg z-10 w-96">
                <h2 className="text-lg font-bold mb-4 text-center text-base-content">{title}</h2>
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative text-center inline-flex items-center justify-center">
                            <span className="text-base text-base-content">{text}</span>
                        </div>
                    </div>

                <div className="flex gap-2 mt-6">
                    {actionBtn}
                    
                    <button className="btn btn-primary btn-outline flex-1" onClick={onClose}>Cancel</button>
                </div>
                
            </div>
        </div>
    );
};

export default ModalWindow;
