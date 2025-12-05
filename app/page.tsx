"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2,
  Car,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  CheckCircle,
} from "lucide-react";

interface FormData {
  student_name: string;
  phone_number: string;
  email: string;
  car_type: string;
  location: string;
  start_date: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    student_name: "",
    phone_number: "",
    email: "",
    car_type: "",
    location: "",
    start_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.student_name.trim()) {
      newErrors.student_name = "Name is required";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      newErrors.phone_number = "Please enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.car_type) {
      newErrors.car_type = "Car type is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting form data:", formData);
      // Submit form data to existing backend
      const response = await fetch(
        "https://next-js-running-backend.vercel.app/api/driving-master",
        {
          method: "POST",
          headers: {
            Authorization: "Basic your_api_token",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Backend submission successful:", result);
        // toast.success(
        //   "Enquiry submitted successfully! We will contact you soon."
        // );

        // Prepare email content for user confirmation
        const userEmailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #333333; margin: 0;">Thank You!</h1>
              <p style="color: #666666; font-size: 16px;">We have received your enquiry.</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333333; margin-top: 0; border-bottom: 1px solid #dddddd; padding-bottom: 10px;">Enquiry Details</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${formData.student_name}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${formData.phone_number}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
              <p style="margin: 5px 0;"><strong>Car Type:</strong> ${formData.car_type}</p>
              <p style="margin: 5px 0;"><strong>Location:</strong> ${formData.location}</p>
              <p style="margin: 5px 0;"><strong>Start Date:</strong> ${formData.start_date}</p>
            </div>

            <div style="text-align: center; color: #888888; font-size: 14px;">
              <p>We will contact you soon to discuss your driving lessons.</p>
              <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} DrivingMaster. All rights reserved.</p>
            </div>
          </div>
        `;

        // Prepare email content for lead notification to connect@drivingmaster.in
        const leadEmailBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
            <div style="background-color: #000000; color: #ffffff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="margin: 0;">New Lead Received</h2>
            </div>
            
            <div style="padding: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #555555; width: 40%;"><strong>Name:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333;">${formData.student_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #555555;"><strong>Phone:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333;">
                    <a href="tel:${formData.phone_number}" style="color: #0066cc; text-decoration: none; font-weight: bold; font-size: 16px;">
                      ${formData.phone_number}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #555555;"><strong>Email:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333;">
                    <a href="mailto:${formData.email}" style="color: #0066cc; text-decoration: none;">
                      ${formData.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #555555;"><strong>Car Type:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333;">${formData.car_type}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #555555;"><strong>Location:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333;">${formData.location}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #555555;"><strong>Start Date:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333;">${formData.start_date}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eeeeee; color: #888888; font-size: 12px;">
              <p>This is an automated notification from the DrivingMaster website.</p>
            </div>
          </div>
        `;

        // Send confirmation email to user
        try {
          console.log("Sending confirmation email to:", formData.email);
          const userEmailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              toEmail: formData.email,
              subject: "DrivingMaster Enquiry Confirmation",
              body: userEmailBody,
            }),
          });

          if (!userEmailResponse.ok) {
            const errorData = await userEmailResponse.json();
            console.error("Failed to send confirmation email:", {
              email: formData.email,
              status: userEmailResponse.status,
              error: errorData.error,
              details: errorData.details || "No additional details",
            });
          } else {
            console.log(
              "Confirmation email sent successfully to:",
              formData.email
            );
          }
        } catch (error: any) {
          console.error("Error sending confirmation email:", {
            email: formData.email,
            message: error.message,
            stack: error.stack,
          });
        }

        // Send lead notification email to connect@drivingmaster.in
        try {
          console.log(
            "Sending lead notification email to: connect@drivingmaster.in"
          );
          const leadEmailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              toEmail: "connect@drivingmaster.in",
              subject: "New DrivingMaster Lead",
              body: leadEmailBody,
            }),
          });

          if (!leadEmailResponse.ok) {
            const errorData = await leadEmailResponse.json();
            console.error("Failed to send lead notification email:", {
              email: "connect@drivingmaster.in",
              status: leadEmailResponse.status,
              error: errorData.error,
              details: errorData.details || "No additional details",
            });
          } else {
            console.log(
              "Lead notification email sent successfully to: connect@drivingmaster.in"
            );
          }
        } catch (error: any) {
          console.error("Error sending lead notification email:", {
            email: "connect@drivingmaster.in",
            message: error.message,
            stack: error.stack,
          });
        }

        // Reset form and show success UI
        setFormData({
          student_name: "",
          phone_number: "",
          email: "",
          car_type: "",
          location: "",
          start_date: "",
        });
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error("Backend submission failed:", {
          status: response.status,
          error: errorData.error || "No error message provided",
        });
        throw new Error("Failed to submit enquiry");
      }
    } catch (error: any) {
      console.error("Form submission error:", {
        message: error.message,
        stack: error.stack,
      });
      toast.error("Failed to submit enquiry or send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Get tomorrow's date as minimum start date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-black/10 rounded-full -translate-y-48 translate-x-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-48 -translate-x-48 blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4 leading-tight">
              Learn from the Best Car Driving Instructors
            </h1>
            <p className="text-xl md:text-2xl text-black/80 font-medium">
              Book your personal car driving instructor at your doorsteps
            </p>
          </div>

          {/* Form or Success Message */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-sm bg-white/95 transition-all duration-500">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
                <p className="text-xl text-gray-600 max-w-md">
                  Your enquiry has been submitted successfully. We will contact
                  you shortly.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 h-12 px-8 text-lg font-semibold bg-black hover:bg-gray-800 text-white transition-all duration-200"
                >
                  Submit Another Enquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-gray-700 font-medium flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Name*
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.student_name}
                      onChange={(e) =>
                        handleInputChange("student_name", e.target.value)
                      }
                      className={`h-12 text-lg ${errors.student_name ? "border-red-500" : ""
                        }`}
                    />
                    {errors.student_name && (
                      <p className="text-red-500 text-sm">
                        {errors.student_name}
                      </p>
                    )}
                  </div>

                  {/* Car Type Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="car-type"
                      className="text-gray-700 font-medium flex items-center gap-2"
                    >
                      <Car className="w-4 h-4" />
                      Car Type: Manual/Automatic*
                    </Label>
                    <Select
                      value={formData.car_type}
                      onValueChange={(value) =>
                        handleInputChange("car_type", value)
                      }
                    >
                      <SelectTrigger
                        className={`h-12 text-lg ${errors.car_type ? "border-red-500" : ""
                          }`}
                      >
                        <SelectValue placeholder="Select car type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.car_type && (
                      <p className="text-red-500 text-sm">{errors.car_type}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-gray-700 font-medium flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Phone*
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone_number}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      className={`h-12 text-lg ${errors.phone_number ? "border-red-500" : ""
                        }`}
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-sm">
                        {errors.phone_number}
                      </p>
                    )}
                  </div>

                  {/* Location Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="text-gray-700 font-medium flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Location*
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter your location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className={`h-12 text-lg ${errors.location ? "border-red-500" : ""
                        }`}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm">{errors.location}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email*
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`h-12 text-lg ${errors.email ? "border-red-500" : ""
                        }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Start Date Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="start-date"
                      className="text-gray-700 font-medium flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Start Date*
                    </Label>
                    <Input
                      id="start-date"
                      type="date"
                      min={minDate}
                      value={formData.start_date}
                      onChange={(e) =>
                        handleInputChange("start_date", e.target.value)
                      }
                      className={`h-12 text-lg ${errors.start_date ? "border-red-500" : ""
                        }`}
                    />
                    {errors.start_date && (
                      <p className="text-red-500 text-sm">
                        {errors.start_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 text-xl font-bold bg-black hover:bg-gray-800 text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "ENQUIRE NOW"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-black/80 text-lg font-medium">
              Get answers to all your queries by sending your enquiry or call{" "}
              <a
                href="tel:8828007799"
                className="font-bold text-black hover:underline transition-all duration-200"
              >
                8828007799
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

