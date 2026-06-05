import { SharedTripPage } from "@/src/features/demo/SharedTripPage";

interface ShareTripPageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export default async function ShareTripPage({ params }: ShareTripPageProps) {
  const { tripId } = await params;

  return <SharedTripPage tripId={tripId} />;
}
