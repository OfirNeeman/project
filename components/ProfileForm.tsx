import React, { useState, useRef, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs-core';

// 1. הגדרת הכתובת בראש הקובץ (וודאי שזו כתובת ה-IP המעודכנת של המחשב שלך)
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

  // 1. אתחול מודל הזיהוי והפעלת מצלמה
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
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // 2. לולאת זיהוי בזמן אמת
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
    if (ctx) ctx.drawImage(videoRef.