export const normalizeWeatherData = (rawData, city, countryCode) => {
  const toISO = (unix, offset) => {
    return new Date((unix + offset) * 1000).toISOString();
  };

  const toLocalTime = (unix, offset) => {
    return new Date((unix + offset) * 1000);
  };

  const windDirection = (deg) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  const weatherInfo = rawData.weather?.[0] ?? {};

  return {
    metadata: {
      responseCode: rawData.cod,
      base: rawData.base,
      cityId: rawData.id,
      timeZoneOffset: rawData.timezone,
    },
    location: {
      city: city || rawData.name,
      countryCode: countryCode || rawData.sys.country,
      coordinates: {
        longitude: rawData.coord.lon,
        latitude: rawData.coord.lat,
      },
    },
    current: {
      timestamp: {
        unix: rawData.dt,
        iso: toISO(rawData.dt, rawData.timezone),
        localDate: toLocalTime(rawData.dt, rawData.timezone),
      },
      temperature: {
        current: rawData.main.temp,
        feelsLike: rawData.main.feels_like,
        min: rawData.main.temp_min,
        max: rawData.main.temp_max,
        unit: "°C",
      },
      pressure: {
        seaLeve: rawData.main.sea_level,
        groundLevel: rawData.main.grnd_level,
        value: rawData.main.pressure,
        unit: "hPa",
      },
      humidity: {
        value: rawData.main.humidity,
        unit: "%",
      },
      visibility: {
        value: rawData.visibility,
        unit: "meter",
      },
      wind: {
        speed: rawData.wind.speed,
        speedUnit: "m/s",
        degree: rawData.wind.deg,
        direction: windDirection(rawData.wind.deg),
      },
      clouds: {
        coverage: rawData.clouds.all,
        unit: "%",
      },
      weather: {
        id: weatherInfo.id,
        condition: weatherInfo.main,
        description: weatherInfo.description,
        iconCode: weatherInfo.icon,
      },
    },
    sun: {
      sunrise: {
        unix: rawData.sys.sunrise,
        iso: toISO(rawData.sys.sunrise, rawData.timezone),
      },
      sunset: {
        unix: rawData.sys.sunset,
        iso: toISO(rawData.sys.sunset, rawData.timezone),
      },
    },
    system: {
      type: rawData.sys.type,
      id: rawData.sys.id,
      country: rawData.sys.country,
    },
  };
};
