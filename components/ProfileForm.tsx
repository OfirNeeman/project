import React, { useState, useRef, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';

// 1. הגדרת הכתובת בראש הקובץ עם HTTPS וכתובת ה-IP שלך
const API_BASE_URL = 'https://192.168.1.149:4000'; 

interface ProfileFormProps {
  onProfileComplete: (profile: any) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onProfileComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState("מפעיל מצלמה...");
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);

  // אתחול מודל הזיהוי והפעלת מצלמה
  useEffect(() => {
    const init = async () => {
      try {
        await tf.ready(); 
        const model = poseDetection.SupportedModels.MoveNet;
        const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
        const newDetector = await poseDetection.createDetector(model, detectorConfig);
        setDetector(newDetector);

        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStatus("עמדי מול המצלמה כך שיראו את כל הגוף");
      } catch (err) {
        console.error("Camera error:", err);
        setStatus("שגיאה באתחול המצלמה. ודאי שאישרת גישה.");
      }
    };

    init();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // לולאת זיהוי בזמן אמת
  useEffect(() => {
    let interval: number;
    if (detector && !isAnalyzing) {
      interval = window.setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          const poses = await detector.estimatePoses(videoRef.current);
          checkPose(poses);
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [detector, isAnalyzing]);

  const checkPose = (poses: poseDetection.Pose[]) => {
    if (poses.length === 0) return;
    const keypoints = poses[0].keypoints;
    const nose = keypoints.find(k => k.name === 'nose');
    const leftAnkle = keypoints.find(k => k.name === 'left_ankle');
    const rightAnkle = keypoints.find(k => k.name === 'right_ankle');

    if (nose?.score! > 0.5 && (leftAnkle?.score! > 0.5 || rightAnkle?.score! > 0.5)) {
      setStatus("מזוהה! סורק בעוד 3 שניות...");
      setIsAnalyzing(true); 
      setTimeout(captureAndUpload, 3000);
    }
  };

  const captureAndUpload = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // כאן הקוד שלך נקטע - זה התיקון:
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
    }

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/upload-profile-image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        
        const data = await response.json();
        if (data.success) {
          onProfileComplete(data.profile);
        } else {
          alert("שגיאת ניתוח: " + data.message);
          setIsAnalyzing(false);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setIsAnalyzing(false);
      }
    }, 'image/jpeg');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center">
      <h2 className="text-3xl font-bold text-stone-800 mb-4">בואי נכיר אותך! 🍌</h2>
      <p className="text-pink-600 font-medium mb-4">{status}</p>
      
      <div className="relative border-4 border-pink-200 rounded-xl overflow-hidden bg-black aspect-video">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none">
          <div className="w-full h-full border-2 border-dashed border-white/50 rounded-lg" />
        </div>
      </div>

      {isAnalyzing && (
        <div className="mt-6 p-4 bg-pink-50 rounded-lg animate-pulse">
          <p className="text-pink-600 font-bold">ננו בננה מנתח את הסטייל שלך...</p>
        </div>
      )}
    </div>
  );
};