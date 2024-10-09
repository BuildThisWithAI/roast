import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center p-4">
      <Loader2 className="size-8 animate-spin" />
    </div>
  );
}
