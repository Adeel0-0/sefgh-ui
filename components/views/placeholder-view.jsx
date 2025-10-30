"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlaceholderView({ title, description, icon: Icon }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            {Icon && <Icon className="h-8 w-8" />}
            <CardTitle className="text-3xl">{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              This feature is coming soon. Stay tuned for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
