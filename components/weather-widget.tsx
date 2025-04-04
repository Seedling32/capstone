import Image from 'next/image';
import { Card, CardContent, CardHeader } from './ui/card';

const WeatherWidget = async () => {
  const response = await fetch(
    'https://api.weather.gov/gridpoints/GSP/57,74/forecast'
  );

  const data = await response.json();
  type weatherData = {
    number: number;
    name: string;
    icon: string;
    shortForecast: string;
    temperature: number;
    temperatureUnit: string;
    probabilityOfPrecipitation: {
      value: number | null;
    };
  };

  return (
    <Card className="bg-mountains flex flex-col items-center gap-4">
      <CardHeader className="h3-bold text-center bg-slate-600/50 p-2 mt-2 rounded-md">
        Asheville Weather
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 md:flex-row mb-2 p-0 mx-2 w-full justify-around">
        {data.properties.periods.slice(0, 3).map((day: weatherData) => (
          <div
            key={day.number}
            className="flex items-center gap-6 bg-slate-600/50 p-2 rounded-md"
          >
            <Image
              src={day.icon}
              alt="Weather icon"
              height={75}
              width={75}
              className="rounded-sm"
            />
            <div>
              <p className="font-semibold">{day.name}</p>
              <p>{day.shortForecast}</p>
              <p>
                High: {day.temperature}
                {day.temperatureUnit}
              </p>
              <p>
                Chance of rain:{' '}
                {day.probabilityOfPrecipitation.value
                  ? day.probabilityOfPrecipitation.value
                  : '0'}
                &#37;
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
