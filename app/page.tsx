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
        toast.success(
          "Enquiry submitted successfully! We will contact you soon."
        );
        setFormData({
          student_name: "",
          phone_number: "",
          email: "",
          car_type: "",
          location: "",
          start_date: "",
        });
      } else {
        throw new Error("Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit enquiry. Please try again.");
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

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-sm bg-white/95">
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
                    className={`h-12 text-lg ${
                      errors.student_name ? "border-red-500" : ""
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
                      className={`h-12 text-lg ${
                        errors.car_type ? "border-red-500" : ""
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
                    className={`h-12 text-lg ${
                      errors.phone_number ? "border-red-500" : ""
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
                    className={`h-12 text-lg ${
                      errors.location ? "border-red-500" : ""
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`h-12 text-lg ${
                      errors.email ? "border-red-500" : ""
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
                    className={`h-12 text-lg ${
                      errors.start_date ? "border-red-500" : ""
                    }`}
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm">{errors.start_date}</p>
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
