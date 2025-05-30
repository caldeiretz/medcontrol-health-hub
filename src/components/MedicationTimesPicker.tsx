
import { useState, useEffect } from "react";
import { Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MedicationTimesPickerProps {
  frequency: string;
  customTimes: string[];
  onCustomTimesChange: (times: string[]) => void;
}

const MedicationTimesPicker = ({ frequency, customTimes, onCustomTimesChange }: MedicationTimesPickerProps) => {
  const [useCustomTimes, setUseCustomTimes] = useState(customTimes.length > 0);
  const [newTime, setNewTime] = useState("");

  const getDefaultTimes = (freq: string) => {
    switch (freq) {
      case "1x ao dia":
        return ["08:00"];
      case "12/12h":
        return ["08:00", "20:00"];
      case "8/8h":
        return ["08:00", "16:00", "00:00"];
      case "6/6h":
        return ["08:00", "14:00", "20:00", "02:00"];
      default:
        return ["08:00"];
    }
  };

  const defaultTimes = getDefaultTimes(frequency);

  useEffect(() => {
    if (!useCustomTimes) {
      onCustomTimesChange([]);
    } else if (customTimes.length === 0) {
      onCustomTimesChange(defaultTimes);
    }
  }, [useCustomTimes, frequency]);

  const addTime = () => {
    if (newTime && !customTimes.includes(newTime)) {
      const updatedTimes = [...customTimes, newTime].sort();
      onCustomTimesChange(updatedTimes);
      setNewTime("");
    }
  };

  const removeTime = (timeToRemove: string) => {
    onCustomTimesChange(customTimes.filter(time => time !== timeToRemove));
  };

  const displayTimes = useCustomTimes ? customTimes : defaultTimes;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Horários de Tomada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="useCustomTimes"
            checked={useCustomTimes}
            onChange={(e) => setUseCustomTimes(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="useCustomTimes" className="text-sm">
            Configurar horários personalizados
          </Label>
        </div>

        <div>
          <Label className="text-sm text-gray-600">
            {useCustomTimes ? "Horários personalizados:" : "Horários padrão:"}
          </Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {displayTimes.map((time, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                <Clock className="h-3 w-3" />
                {time}
                {useCustomTimes && (
                  <button
                    type="button"
                    onClick={() => removeTime(time)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {useCustomTimes && (
          <div className="flex gap-2">
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={addTime}
              disabled={!newTime || customTimes.includes(newTime)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500">
          {useCustomTimes 
            ? "Adicione horários específicos para tomar esta medicação."
            : "Os horários padrão serão usados baseados na frequência selecionada."
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default MedicationTimesPicker;
