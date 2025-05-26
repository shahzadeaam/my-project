
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, LineChart } from "lucide-react";

interface PlaceholderChartProps {
  type?: 'line' | 'bar';
  message?: string;
}

export default function PlaceholderChart({ type = 'line', message = "نمودار در این بخش نمایش داده خواهد شد." }: PlaceholderChartProps) {
  return (
    <div className="w-full h-[300px] flex items-center justify-center bg-muted/50 rounded-lg border border-dashed border-border p-4">
      <div className="text-center text-muted-foreground">
        {type === 'line' ? <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" /> : <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />}
        <p className="text-sm">{message}</p>
        <p className="text-xs mt-1">(این یک نمودار نمایشی است)</p>
      </div>
    </div>
  );
}
