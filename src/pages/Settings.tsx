
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { SettingsLayout } from "@/components/settings/SettingsLayout";

const Settings = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout user={user}>
      <SettingsLayout user={user} />
    </MainLayout>
  );
};

export default Settings;
