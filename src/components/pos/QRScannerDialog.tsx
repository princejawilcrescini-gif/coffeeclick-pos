import { X, Camera, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface QRScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export function QRScannerDialog({ isOpen, onClose, onScan }: QRScannerDialogProps) {
  const [scanning, setScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
      setScannedCode(null);
      
      // Simulate scanning after 2 seconds
      const timer = setTimeout(() => {
        const mockCodes = ["PROD-001", "PROD-002", "PROD-003", "PROD-004"];
        const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
        setScannedCode(randomCode);
        setScanning(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUseCode = () => {
    if (scannedCode) {
      onScan(scannedCode);
      onClose();
    }
  };

  const handleRescan = () => {
    setScanning(true);
    setScannedCode(null);
    
    setTimeout(() => {
      const mockCodes = ["PROD-001", "PROD-002", "PROD-003", "PROD-004"];
      const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
      setScannedCode(randomCode);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 pos-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">QR Code Scanner</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner View */}
        <div className="p-6">
          <div className="relative aspect-square bg-secondary/50 rounded-xl overflow-hidden mb-4">
            {/* Scanner Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              {scanning ? (
                <div className="relative w-48 h-48">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-lg" />
                  
                  {/* Scanning line */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary/80 animate-[scan_2s_ease-in-out_infinite]" 
                       style={{ 
                         animation: "scan 2s ease-in-out infinite",
                       }} 
                  />
                  
                  {/* Camera icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-10 h-10 text-success" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Code Detected!</p>
                  <p className="text-2xl font-bold text-primary mt-2">{scannedCode}</p>
                </div>
              )}
            </div>
          </div>

          {scanning ? (
            <div className="text-center">
              <p className="text-muted-foreground">Position the QR code within the frame</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-primary pos-pulse" />
                <span className="text-sm text-primary font-medium">Scanning...</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleRescan}>
                Scan Again
              </Button>
              <Button className="flex-1" onClick={handleUseCode}>
                Use This Code
              </Button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(180px); }
        }
      `}</style>
    </div>
  );
}
