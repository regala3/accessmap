import { useEffect } from 'react';
import QRCode from 'react-qr-code';

const QRCodePage = ({ open, onClose, title, qrValue }) => {
    useEffect(() => {
        if (!open) return;

        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
            <div className="bg-white p-6 rounded shadow-lg z-10 w-96">
                <h2 className="text-lg font-bold mb-4 text-center">{title}</h2>
                {qrValue && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative inline-flex items-center justify-center">
                            <QRCode 
                                value={qrValue}
                                size={300}
                                level="H"
                                includeMargin={true}
                            />
                            <img 
                                src="/logo3t.png"
                                alt="Logo"
                                className="absolute w-16 h-16 bg-white rounded-md p-1"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-600">Scan to view the event map</p>
                    </div>
                )}
                <div className="flex gap-2 mt-6">
                    <button className="btn btn-primary btn-outline flex-1" onClick={() => window.print()}>
                        Print
                    </button>
                    <button className="btn btn-primary btn-outline flex-1" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default QRCodePage;
