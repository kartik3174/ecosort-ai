"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Upload,
  Loader2,
  MapPin,
  Map as MapIcon,
  ClipboardList,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Recycle as RecycleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { checkForHazards } from "@/app/citizen/tag-litter/actions";
import type { DetectHazardousWasteOutput } from "@/ai/flows/hazardous-waste-detection-flow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type SubmissionStatus = "idle" | "success";
type Tag = "still_there" | "picked_up" | "hazardous" | "recyclable";

export function TagLitterForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState<Tag | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle");
  const [aiResult, setAiResult] = useState<DetectHazardousWasteOutput | null>(null);
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (imageDataUri) {
      startAnalyzing(async () => {
        const result = await checkForHazards({ photoDataUri: imageDataUri });
        setAiResult(result);
        if (result.isHazardous) {
          setTag("hazardous");
          toast({
            variant: "destructive",
            title: "Potential Hazard Detected",
            description: result.reasoning,
          });
        }
      });
    }
  }, [imageDataUri, toast]);

  useEffect(() => {
    const stopCameraStream = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    const startCameraStream = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: "destructive",
          title: "Camera Not Supported",
          description: "Your browser does not support camera access.",
        });
        setHasCameraPermission(false);
        setIsCameraOpen(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error: any) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        setIsCameraOpen(false);
        
        let title = "Camera Error";
        let description = "An unexpected error occurred while accessing the camera.";

        if (error.name === 'NotAllowedError') {
            title = "Camera Access Denied";
            description = "Please enable camera permissions in your browser settings to use this feature.";
        } else if (error.name === 'NotFoundError') {
            title = "No Camera Found";
            description = "We couldn't find a camera on your device. Please connect a camera and try again.";
        } else if (error.name === 'NotReadableError') {
            title = "Could Not Access Camera";
            description = "Could not start video source. The camera might be in use by another application or there might be a hardware issue.";
        }

        toast({
          variant: "destructive",
          title: title,
          description: description,
        });
      }
    };

    if (isCameraOpen) {
      startCameraStream();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [isCameraOpen, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const dataUriReader = new FileReader();
      dataUriReader.onload = (e) => {
        setImageDataUri(e.target?.result as string);
      };
      dataUriReader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCapturePhotoClick = () => {
    setIsCameraOpen(true);
  };

  const handleTakePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUri);
        setImageDataUri(dataUri);
      }
      setIsCameraOpen(false);
    }
  };

  const handleTagSelect = (selectedTag: Tag) => {
    setTag(selectedTag);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !tag) {
      toast({
        variant: "destructive",
        title: "Incomplete Report",
        description: "Please upload a photo and select a tag.",
      });
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmissionStatus("success");
    if(tag === 'hazardous') {
        toast({
            variant: "destructive",
            title: "⚠️ Hazardous Litter Reported",
            description: "A priority alert has been sent to the authorities. Thank you for your vigilance.",
            duration: 9000,
        });
    } else {
        toast({
            title: "✅ Report Submitted",
            description: "Thank you for helping keep our city clean!",
        });
    }
  };
  
  const resetForm = () => {
    setImagePreview(null);
    setImageDataUri(null);
    setDescription("");
    setTag(null);
    setSubmissionStatus("idle");
    setAiResult(null);
    setIsCameraOpen(false);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  if (submissionStatus === "success") {
    return (
      <Card className="max-w-2xl mx-auto text-center p-8">
        <CardContent className="p-0">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Submitted Successfully</h2>
          <p className="text-muted-foreground mb-6">
            Your report has been sent to the city officials. Thank you for your contribution!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/citizen/map">
                <MapIcon /> View on Map
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/citizen/my-reports">
                <ClipboardList /> View My Reports
              </Link>
            </Button>
          </div>
            <Button variant="link" onClick={resetForm} className="mt-4">Submit Another Report</Button>
        </CardContent>
      </Card>
    );
  }

  const tagOptions: { id: Tag, label: string, icon: React.ElementType, variant: "destructive" | "default" | "secondary" }[] = [
    { id: 'hazardous', label: 'Hazardous Waste', icon: ShieldAlert, variant: 'destructive' },
    { id: 'still_there', label: 'Still There', icon: Trash2, variant: 'secondary' },
    { id: 'picked_up', label: 'Picked Up', icon: CheckCircle2, variant: 'secondary' },
    { id: 'recyclable', label: 'Recyclable', icon: RecycleIcon, variant: 'secondary' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-start">
          <div>
            {isCameraOpen ? (
              <div className="relative w-full aspect-video border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center text-center p-4 bg-black">
                <video ref={videoRef} className="w-full h-full rounded-md object-cover" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                  <Alert variant="destructive" className="absolute bottom-20 left-4 right-4 w-auto z-10">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>Please allow camera access to use this feature.</AlertDescription>
                  </Alert>
                )}
                <div className="absolute bottom-4 flex gap-4 z-10">
                  <Button type="button" onClick={handleTakePicture} disabled={!hasCameraPermission}>
                    <Camera /> Take Picture
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setIsCameraOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : !imagePreview ? (
              <div className="relative w-full aspect-video border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center text-center p-4">
                <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-semibold mb-2">Large Photo Capture Area</h3>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button type="button" onClick={handleUploadClick}>
                    <Upload /> Upload Photo
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCapturePhotoClick}>
                    <Camera /> Capture Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <Image src={imagePreview} alt="Litter preview" layout="fill" objectFit="cover" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
                <Button type="button" variant="destructive" size="sm" onClick={resetForm} className="absolute top-2 right-2 z-10">
                  <Trash2 className="h-4 w-4 mr-2" /> Change Photo
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            {imagePreview && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Tag Litter</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {tagOptions.map((opt) => (
                      <Button
                        key={opt.id}
                        type="button"
                        variant={tag === opt.id ? opt.variant : "outline"}
                        onClick={() => handleTagSelect(opt.id)}
                        className={cn("justify-start h-12", tag === opt.id && "ring-2 ring-primary")}
                      >
                        <opt.icon className="h-5 w-5 mr-2" />
                        <span>{opt.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {aiResult && aiResult.isHazardous && (
                  <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>AI Analysis: Hazardous Material Detected!</AlertTitle>
                    <AlertDescription>
                      {aiResult.reasoning}
                      {aiResult.hazardousMaterials && aiResult.hazardousMaterials.length > 0 && (
                        <div className="mt-2">
                          {aiResult.hazardousMaterials.map((mat) => (
                            <Badge key={mat} variant="destructive" className="mr-1">
                              {mat}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>
                      Automatically detected: <strong>Chennai, India</strong>
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Additional Details</h3>
                  <Textarea
                    placeholder="Add description (e.g., 'behind the bus stop', 'large pile of plastic bottles')"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button type="submit" size="lg" disabled={isSubmitting || isAnalyzing || !tag}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Litter Report"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
