
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";

interface ProfileHeaderProps {
  profile: {
    name: string;
    specialty: string;
    crm: string;
  };
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handlePhotoChange = (photoUrl: string | null) => {
    setProfilePhoto(photoUrl);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-green-500 border-0 text-white shadow-xl">
      <CardContent className="pt-8 pb-6">
        <div className="flex items-center space-x-6">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <ProfilePhotoUpload
              currentPhoto={profilePhoto}
              fallbackText={profile.name.split(' ').map(n => n[0]).join('')}
              size="lg"
              onPhotoChange={handlePhotoChange}
            />
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
            <p className="text-blue-100 text-lg">{profile.specialty}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                {profile.crm}
              </Badge>
              <Badge className="bg-green-500/30 text-green-100 border-green-300/50">
                ● Ativo
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
