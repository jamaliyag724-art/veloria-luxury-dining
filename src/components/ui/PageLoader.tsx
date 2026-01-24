import { useEffect, useState } from "react";
import VeloriaLoader from "@/components/ui/VeloriaLoader";

interface PageLoaderProps {
  children: React.ReactNode;
  duration?: number;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  children,
  duration = 1600,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (loading) {
    return <VeloriaLoader />;
  }

  return <>{children}</>;
};

export default PageLoader;
