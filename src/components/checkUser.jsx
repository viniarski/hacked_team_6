"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function CheckUser() {
  const [checked, setChecked] = useState(false);
  const userId = useAuth();
  
  useEffect(() => {
    if (userId.userId === undefined) {
      setChecked(true);
    } else {
    const checkUser = async () => {
      try {
        const response = await fetch("/api/auth-check");
        if (response.ok) {
          setChecked(true);
        } else {
          const errorData = await response.json();
          console.error("Failed to verify user:", errorData);
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    if (!checked) {
      checkUser();
    }
  }
  }, [checked]);

  return null; // renders nothing
}
