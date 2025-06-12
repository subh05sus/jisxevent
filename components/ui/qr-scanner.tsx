"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CameraIcon, XIcon } from "lucide-react";

interface QRScannerProps {
  onResult: (result: string) => void;
  onError?: (error: Error) => void;
  isActive: boolean;
  onClose: () => void;
}

export function QRScanner({
  onResult,
  onError,
  isActive,
  onClose,
}: QRScannerProps) {
  const scannerRef = useRef<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [Html5QrcodeScanner, setHtml5QrcodeScanner] = useState<any>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const loadScanner = async () => {
      try {
        const { Html5QrcodeScanner: Scanner } = await import("html5-qrcode");
        setHtml5QrcodeScanner(() => Scanner);
      } catch (error) {
        console.error("Failed to load QR scanner:", error);
        if (onError) {
          onError(error as Error);
        }
      }
    };

    loadScanner();
  }, []);

  useEffect(() => {
    if (!isActive || !Html5QrcodeScanner) {
      cleanup();
      return;
    }

    startScanning();

    return () => {
      cleanup();
    };
  }, [isActive, Html5QrcodeScanner]);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setHasPermission(true);

      // Create scanner instance
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false // verbose logging
      );

      scannerRef.current = scanner;
      scanner.render(
        (decodedText: string, decodedResult: any) => {
          // Handle successful scan
          onResult(decodedText);
          cleanup();
        },
        (error: any) => {
          // Handle scan error (but don't report "not found" errors)
          if (!error.includes("No QR code found")) {
            console.warn("QR scan error:", error);
          }
        }
      );
    } catch (err) {
      console.error("Error starting camera:", err);
      setHasPermission(false);
      setIsScanning(false);
      if (onError) {
        onError(err as Error);
      }
    }
  };

  const cleanup = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (err) {
        console.warn("Error clearing scanner:", err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {hasPermission === false ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <CameraIcon className="h-5 w-5 mr-2" />
                Camera Access Required
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Please allow camera access to scan QR codes. You may need to
              refresh the page and try again.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <CameraIcon className="h-5 w-5 mr-2" />
                Scan QR Code
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* QR Scanner Container */}
              <div id="qr-reader" className="w-full"></div>

              <p className="text-sm text-gray-600 text-center">
                Position the QR code within the frame to scan. Allow camera
                access when prompted.
              </p>

              <div className="flex justify-center">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
